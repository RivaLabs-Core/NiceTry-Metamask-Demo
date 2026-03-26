import { http, encodeFunctionData, concat } from 'viem'
import { baseSepolia } from 'viem/chains'
import { createSmartAccountClient } from 'permissionless'
import {
  publicClient,
  ENTRYPOINT_ADDRESS,
  buildSmartAccountFromWallet,
  ownerAbi,
} from '../config/smartAccount'

// ── ABIs ──────────────────────────────────────────────────────────────────────

const executeAbi = [{
  name: 'execute', type: 'function', stateMutability: 'nonpayable',
  inputs: [
    { name: 'to',    type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data',  type: 'bytes'   },
  ],
  outputs: [],
}]

// ── CDP RPC ─────────────────────────────────────────────────────────────────

async function cdpRpc(method, params) {
  const url = process.env.NEXT_PUBLIC_PAYMASTER_URL
  if (!url) throw new Error('NEXT_PUBLIC_PAYMASTER_URL not set')
  const res = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { jsonrpc: '2.0', id: 1, method, params },
      (_, v) => typeof v === 'bigint' ? '0x' + v.toString(16) : v
    ),
  })
  const text = await res.text()
  let json
  try   { json = JSON.parse(text) }
  catch { throw new Error(`[cdpRpc] non-JSON response: ${text.slice(0, 300)}`) }
  if (json.error) throw new Error(`[cdpRpc] ${method}: ${JSON.stringify(json.error)}`)
  return json.result
}

// ── Smart account client ────────────────────────────────────────────────────

function buildClient(account) {
  return createSmartAccountClient({
    account,
    chain:            baseSepolia,
    bundlerTransport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
    paymaster: {
      getPaymasterData:     op => cdpRpc('pm_getPaymasterData',     [op, ENTRYPOINT_ADDRESS, '0x' + baseSepolia.id.toString(16)]),
      getPaymasterStubData: op => cdpRpc('pm_getPaymasterStubData', [op, ENTRYPOINT_ADDRESS, '0x' + baseSepolia.id.toString(16)]),
    },
    userOperation: {
      estimateFeesPerGas: async () => {
        const { baseFeePerGas } = await publicClient.getBlock()
        const base = baseFeePerGas ?? 1_000_000n
        return { maxFeePerGas: base * 2n, maxPriorityFeePerGas: 2_000_000n }
      },
    },
  })
}

// ── createSmartAccount ──────────────────────────────────────────────────────

export async function createSmartAccount(walletClient) {
  if (!process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS) throw new Error('FACTORY_ADDRESS not set')
  const account = await buildSmartAccountFromWallet(walletClient)
  localStorage.setItem('SmartAccount', account.address)
  return account
}

// ── rotation (native ETH) ───────────────────────────────────────────────────
// Sends native ETH to recipient and rotates the owner to nextOwnerAddress.
// amount is in wei (bigint).

export async function rotation(walletClient, recipientAddress, nextOwnerAddress, amountWei) {
 
  
  const contractAddress = localStorage.getItem('SmartAccount')
  const currentOwner    = walletClient?.account?.address

  if (!contractAddress)  throw new Error('No smart account in localStorage')
  if (!recipientAddress) throw new Error('recipientAddress missing')
  if (!nextOwnerAddress) throw new Error('nextOwnerAddress missing')

  // 0. Pre-flight: verify on-chain owner
  const bytecode = await publicClient.getBytecode({ address: contractAddress })
  const isDeployed = !!bytecode && bytecode !== '0x'
console.log('called');
  if (isDeployed) {
    const onChainOwnerPre = await publicClient.readContract({
      address: contractAddress, abi: ownerAbi, functionName: 'owner',
    })
    if (onChainOwnerPre.toLowerCase() !== currentOwner.toLowerCase()) {
      throw new Error(
        `Not the owner!\nOn-chain owner: ${onChainOwnerPre}\nMetaMask: ${currentOwner}`
      )
    }
  }

  // 1-2. Build account + client
  const account = await buildSmartAccountFromWallet(walletClient, contractAddress)
  const client  = buildClient(account)

  // 3. Encode callData — native ETH: execute(recipient, amountWei, "0x") + nextOwner
  const callData = concat([
    encodeFunctionData({
      abi: executeAbi, functionName: 'execute',
      args: [
        recipientAddress,
        amountWei,
        '0x',
      ],
    }),
    nextOwnerAddress,
  ])

  // 4. Send UserOp
  const userOpHash = await client.sendUserOperation({ callData })
 
  // 5. Poll receipt
  let receipt = null
  for (let i = 0; i < 60; i++) {
    try {
      receipt = await cdpRpc('eth_getUserOperationReceipt', [userOpHash])
      if (receipt) break
    } catch { /* retry */ }
    await new Promise(r => setTimeout(r, 2000))
  }
  if (!receipt)         throw new Error('Timeout — no receipt after 120s')
  if (!receipt.success) throw new Error(`UserOp reverted: ${JSON.stringify(receipt)}`)

  // 6. Verify post-rotation owner
  const onChainOwnerPost = await publicClient.readContract({
    address: contractAddress, abi: ownerAbi, functionName: 'owner',
  })
  if (onChainOwnerPost.toLowerCase() !== nextOwnerAddress.toLowerCase()) {
    throw new Error(`Owner not rotated! On-chain: ${onChainOwnerPost} | Expected: ${nextOwnerAddress}`)
  }

  // Update pool — remove both old owner and the used next owner
  const pool = JSON.parse(localStorage.getItem('addresses') || '[]')
  const updatedPool = pool.filter(a =>
    a.toLowerCase() !== nextOwnerAddress.toLowerCase() &&
    a.toLowerCase() !== currentOwner.toLowerCase()
  )
  localStorage.setItem('addresses', JSON.stringify(updatedPool))

  return {
    userOpHash,
    txHash:        receipt.receipt.transactionHash,
    previousOwner: currentOwner,
    newOwner:      nextOwnerAddress,
    recipientAddress,
  }
}

export { publicClient }
