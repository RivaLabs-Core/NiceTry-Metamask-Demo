import { toSimpleSmartAccount } from 'permissionless/accounts'
import { createPublicClient, http } from 'viem'
import { toAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

export const ENTRYPOINT_ADDRESS = '0x0000000071727De22E5E9d8BAf0edAc6f37da032'
export const FACTORY_ADDRESS    = process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS || ''

export const publicClient = createPublicClient({
  chain:     sepolia,
  transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
})

export const ownerAbi = [{
  name: 'owner', type: 'function', stateMutability: 'view',
  inputs:  [],
  outputs: [{ name: '', type: 'address' }],
}]

export async function buildSmartAccountFromWallet(walletClient, existingAddress) {
  if (!walletClient?.account?.address) throw new Error('walletClient not ready')
  if (!FACTORY_ADDRESS)                throw new Error('FACTORY_ADDRESS not set')

  const owner = toAccount({
    address:         walletClient.account.address,
    signMessage:     ({ message }) => walletClient.signMessage({ message }),
    signTypedData:   (typedData)  => walletClient.signTypedData(typedData),
    signTransaction: ()           => { throw new Error('signTransaction not supported') },
  })

  const account = await toSimpleSmartAccount({
    client:         publicClient,
    owner,
    factoryAddress: FACTORY_ADDRESS,
    ...(existingAddress ? { address: existingAddress } : {}),
    entryPoint:     { address: ENTRYPOINT_ADDRESS, version: '0.7' },
  })

  if (existingAddress) {
    const bytecode   = await publicClient.getBytecode({ address: existingAddress })
    const isDeployed = !!bytecode && bytecode !== '0x'

    if (isDeployed) {
      account.address        = existingAddress
      account.getFactory     = async () => undefined
      account.getFactoryArgs = async () => ({ factory: undefined, factoryData: undefined })
    }
  }

  return account
}
