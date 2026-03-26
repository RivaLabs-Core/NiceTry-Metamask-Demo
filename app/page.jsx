'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useAccount, useWalletClient, useDisconnect } from 'wagmi'
import { isAddress, formatEther, parseEther } from 'viem'

import { ConnectWallet } from './components/ConnectWallet'
import { WalletOperations } from './components/WalletOperations'
import { ActivityLog } from './components/ActivityLog'

import {
  createSmartAccount,
  rotation,
  publicClient,
} from './web3/web3Management'

function useLogger() {
  const [logs, setLogs] = useState([])
  const log = useCallback((msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-GB')
    setLogs(prev => [...prev, { msg, type, time, id: Date.now() + Math.random() }])
  }, [])
  const clear = useCallback(() => setLogs([]), [])
  return { logs, log, clear }
}

const short = addr => addr ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : '—'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { data: walletClient }   = useWalletClient({ chainId: 84532 })
  const { disconnect }           = useDisconnect()
  const { logs, log, clear }     = useLogger()

  const [accountAddress,    setAccountAddress]    = useState('')
  const [pool,              setPool]              = useState([])
  const [loading,           setLoading]           = useState(false)
  const [recipient,         setRecipient]         = useState('')
  const [amount,            setAmount]            = useState('0.001')
  const [balance,           setBalance]           = useState(null)
  const [rotations,         setRotations]         = useState([])
  const [lastTx,            setLastTx]            = useState(null)
  const [currentStep,       setCurrentStep]       = useState(0)
  const [originalAddress,   setOriginalAddress]   = useState('')

  const pendingCreateRef = useRef(false)
  const creatingRef      = useRef(false)

  useEffect(() => {
    const saved       = localStorage.getItem('SmartAccount') ?? ''
    const savedPool   = JSON.parse(localStorage.getItem('addresses') || '[]')
    const savedOrigin = localStorage.getItem('originalAddress') ?? ''
    setAccountAddress(saved)
    setPool(savedPool)
    setOriginalAddress(savedOrigin)
  }, [])

  const handleDisconnect = useCallback(() => {
    localStorage.removeItem('SmartAccount')
    localStorage.removeItem('addresses')
    localStorage.removeItem('originalAddress')
    localStorage.removeItem('expectedNextOwner')
    setAccountAddress(''); setPool([]); setOriginalAddress('')
    setBalance(null); setRotations([]); setLastTx(null)
    setCurrentStep(0); setRecipient(''); setAmount('0.001')
    setLoading(false); clear()
    disconnect()
  }, [disconnect, clear])

  useEffect(() => {
    if (!accountAddress) return
    publicClient.getBalance({ address: accountAddress })
      .then(b => setBalance(formatEther(b)))
      .catch(() => setBalance('—'))
  }, [accountAddress])

  const refreshBalance = async () => {
    if (!accountAddress) return
    try { setBalance(formatEther(await publicClient.getBalance({ address: accountAddress }))) }
    catch { setBalance('—') }
  }

  useEffect(() => {
    if (!address) return
    if (!originalAddress && isConnected) setOriginalAddress(address)
    setPool(prev => {
      const already = prev.map(a => a.toLowerCase()).includes(address.toLowerCase())
      if (already) return prev
      const updated = [...prev, address]
      localStorage.setItem('addresses', JSON.stringify(updated))
      log(`✚ Address added to pool: ${short(address)}`, 'success')
      return updated
    })
  }, [address, isConnected, log])

  useEffect(() => {
    if (!address || !isConnected || !originalAddress) return
    const original = originalAddress.toLowerCase()
    const current  = address.toLowerCase()
    if (currentStep === 1 && current !== original && pool.length >= 2) {
      log(`✓ New account detected: ${short(address)}`, 'success')
      setCurrentStep(2)
    }
    if (currentStep === 2 && current === original) {
      log(`✓ Switched back to original account: ${short(address)}`, 'success')
      setCurrentStep(3)
    }
  }, [address, isConnected, currentStep, pool, originalAddress, log])

  const handleCreate = useCallback(async (wc) => {
    const client = wc || walletClient
    if (!client?.account?.address) { log('walletClient not ready', 'error'); setLoading(false); return }
    if (creatingRef.current) return
    creatingRef.current = true
    setLoading(true)
    try {
      log('═══ CREATE SMART ACCOUNT ═══', 'step')
      const account = await createSmartAccount(client)
      if (!account) throw new Error('createSmartAccount returned null')
      setAccountAddress(account.address)
      setOriginalAddress(client.account.address)
      localStorage.setItem('originalAddress', client.account.address)
      log(`✓ Smart account: ${account.address}`, 'success')
    } catch (err) { log(`ERROR: ${err.message}`, 'error') }
    finally { setLoading(false); creatingRef.current = false }
  }, [walletClient, log])

  useEffect(() => {
    if (!pendingCreateRef.current) return
    if (!walletClient?.account?.address) return
    if (accountAddress) { pendingCreateRef.current = false; setLoading(false); return }
    pendingCreateRef.current = false
    handleCreate(walletClient)
  }, [walletClient, isConnected, accountAddress, handleCreate])

  const onConnectAndCreate = useCallback(() => {
    if (walletClient?.account?.address && !accountAddress) {
      handleCreate(walletClient)
      return
    }
    pendingCreateRef.current = true
    setLoading(true)
    log('Connecting to MetaMask…', 'step')
  }, [walletClient, accountAddress, handleCreate, log])

  const onSetStep = useCallback((step) => { setCurrentStep(step) }, [])

  const handleExecute = async () => {
    if (!walletClient?.account?.address) { log('walletClient not ready', 'error'); return }
    if (!isAddress(recipient)) { log('Invalid recipient', 'error'); return }
    setLoading(true)
    try {
      log('═══ SEND ETH + ROTATE ═══', 'step')
      const currentPool = JSON.parse(localStorage.getItem('addresses') || '[]')
      const currentAddress = walletClient.account.address.toLowerCase()
      const nextOwner = currentPool.find(a => a.toLowerCase() !== currentAddress)
      if (!nextOwner) { log('⚠ No next owner in pool!', 'error'); return }

      log(`Current owner: ${short(walletClient.account.address)}`, 'data')
      log(`Next owner:    ${short(nextOwner)}`, 'data')
      log(`Recipient:     ${short(recipient)}`, 'data')
      log(`Amount:        ${amount} ETH`, 'data')

      const amountWei = parseEther(amount)
      const result = await rotation(walletClient, recipient, nextOwner, amountWei)

      log(`✓ Tx: ${result.txHash}`, 'success')
      log(`✓ Owner rotated: ${short(result.previousOwner)} → ${short(result.newOwner)}`, 'success')

      setLastTx(result)
      setRotations(prev => [result, ...prev])
      const newPool = JSON.parse(localStorage.getItem('addresses') || '[]')
      setPool(newPool)
      setOriginalAddress(result.newOwner)
      localStorage.setItem('originalAddress', result.newOwner)
      setRecipient(''); setAmount('0.001')
      await refreshBalance()
      setCurrentStep(0)
      log('═══ ROTATION COMPLETED ✓ — Repeat from Step 1 ═══', 'success')
    } catch (err) { log(`ERROR: ${err.message}`, 'error') }
    finally { setLoading(false) }
  }

  const isCurrentOwner  = a => a.toLowerCase() === address?.toLowerCase()
  const nextOwnerInPool = pool.find(a => !isCurrentOwner(a))

  const envMissing = [
    !process.env.NEXT_PUBLIC_PAYMASTER_URL && 'NEXT_PUBLIC_PAYMASTER_URL',
    !process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS && 'NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS',
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#171622]">
    <div className='fixed  z-1 inset-0 pointer-events-none '>
        <div className="absolute w-full h-full opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="44.44" height="44.44" patternUnits="userSpaceOnUse">
                <rect width="44.44" height="44.44" fill="none" stroke="#7c847b" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
    </div>

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[36px] font-bold text-white mb-2">Key Rotation Wallet</h1>
          <p className="text-[#3F56E3] text-[18px] uppercase tracking-wider font-semibold">Quantum-Safe Protocol</p>
          <p className="text-[#7c847b] text-[14px] mt-4">Every UserOp rotates the signing key. Old keys are permanently invalidated onchain.</p>
        </div>

        {envMissing.length > 0 && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-8 max-w-2xl mx-auto">
            <p className="text-xs text-red-400 font-semibold">⚠ Incomplete .env</p>
            {envMissing.map(k => <p key={k} className="text-xs text-red-300 font-mono">✕ {k}</p>)}
          </div>
        )}

        <div className="flex gap-[24px] items-start" data-node-id="1:2269">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-[24px]">
            <WalletOperations
              isConnected={isConnected}
              address={address}
              accountAddress={accountAddress}
              balance={balance}
              loading={loading}
              pool={pool}
              rotations={rotations}
              onConnectAndCreate={onConnectAndCreate}
              onDisconnect={handleDisconnect}
              short={short}
            />
            <ConnectWallet
              accountAddress={accountAddress}
              balance={balance}
              rotations={rotations}
              pool={pool}
              address={address}
              currentStep={currentStep}
              recipient={recipient}
              amount={amount}
              onRecipientChange={setRecipient}
              onAmountChange={setAmount}
              onExecute={handleExecute}
              loading={loading}
              nextOwnerInPool={nextOwnerInPool}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-[24px]">
            <ActivityLog
              isConnected={isConnected}
              address={address}
              originalAddress={originalAddress}
              pool={pool}
              currentStep={currentStep}
              onSetStep={onSetStep}
              onExecute={handleExecute}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
