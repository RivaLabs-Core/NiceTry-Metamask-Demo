import { http, encodeFunctionData, concat } from 'viem'
import { sepolia } from 'viem/chains'
import { createSmartAccountClient } from 'permissionless'
import { createPimlicoClient } from 'permissionless/clients/pimlico'
import {
  publicClient,
  ENTRYPOINT_ADDRESS,
  buildSmartAccountFromWallet,
  ownerAbi,
} from '../config/smartAccount'

const executeAbi = [{
  name: 'execute', type: 'function', stateMutability: 'nonpayable',
  inputs: [
    { name: 'to',    type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data',  type: 'bytes'   },
  ],
  outputs: [],
}]

const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY
const pimlicoUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${pimlicoApiKey}`

const paymasterClient = createPimlicoClient({
  transport: http(pimlicoUrl),
  entryPoint: {
    address: ENTRYPOINT_ADDRESS,
    version: '0.7',
  },
})

function buildClient(account) {
  return createSmartAccountClient({
    account,
    chain: sepolia,
    bundlerTransport: http(pimlicoUrl),
    paymaster: paymasterClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await paymasterClient.getUserOperationGasPrice()).fast
      },
    },
  })
}

export async function createSmartAccount(walletClient) {
  if (!process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS) throw new Error('FACTORY_ADDRESS not set')
  const account = await buildSmartAccountFromWallet(walletClient)
  localStorage.setItem('SmartAccount', account.address)
  return account
}

export async function rotation(walletClient, recipientAddress, nextOwnerAddress, amountWei) {
  const contractAddress = localStorage.getItem('SmartAccount')
  const currentOwner    = walletClient?.account?.address

  if (!contractAddress)  throw new Error('No smart account in localStorage')
  if (!recipientAddress) throw new Error('recipientAddress missing')
  if (!nextOwnerAddress) throw new Error('nextOwnerAddress missing')

  const bytecode = await publicClient.getBytecode({ address: contractAddress })
  const isDeployed = !!bytecode && bytecode !== '0x'

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

  const account = await buildSmartAccountFromWallet(walletClient, contractAddress)
  const client  = buildClient(account)

  const callData = concat([
    encodeFunctionData({
      abi: executeAbi, functionName: 'execute',
      args: [recipientAddress, amountWei, '0x'],
    }),
    nextOwnerAddress,
  ])

  const userOpHash = await client.sendUserOperation({ callData })

  const receipt = await client.waitForUserOperationReceipt({
    hash: userOpHash,
    timeout: 120_000,
  })
  if (!receipt.success) throw new Error(`UserOp reverted: ${JSON.stringify(receipt)}`)

  const onChainOwnerPost = await publicClient.readContract({
    address: contractAddress, abi: ownerAbi, functionName: 'owner',
  })
  if (onChainOwnerPost.toLowerCase() !== nextOwnerAddress.toLowerCase()) {
    throw new Error(`Owner not rotated! On-chain: ${onChainOwnerPost} | Expected: ${nextOwnerAddress}`)
  }

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
