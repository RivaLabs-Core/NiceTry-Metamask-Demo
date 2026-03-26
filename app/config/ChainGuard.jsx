'use client'
import { useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export function ChainGuard({ children }) {
  const { chain, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (isConnected && chain?.id !== baseSepolia.id) {
      switchChain({ chainId: baseSepolia.id })
    }
  }, [chain, isConnected])

  return <>{children}</>
}