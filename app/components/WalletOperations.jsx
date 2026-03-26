'use client'

import { useConnect } from 'wagmi'
import { LuWallet } from 'react-icons/lu'

export function WalletOperations({
  isConnected,
  address,
  accountAddress,
  balance,
  loading,
  pool,
  rotations,
  onConnectAndCreate,
  onDisconnect,
  short,
}) {
  const { connect, connectors } = useConnect()
  const metaMaskConnector = connectors.find(c => c.id === 'injected' || c.name === 'MetaMask')

  const handleConnect = () => {
    if (!metaMaskConnector) return
    onConnectAndCreate()
    connect({ connector: metaMaskConnector })
  }

  // ── Not connected ─────────────────────────────────────────────────────────

  if (!isConnected) {
    return (
    <>
        <div className="bg-[#26272A] border border-[#4f564f] rounded-[16px] p-[24px] w-full">
          <h2 className="text-white text-[20px] font-bold font-['Inter'] mb-[20px]">
            Wallet Operations
          </h2>
          <div className="bg-[#353b35] border border-[#4f564f] rounded-[16px] px-[24px] py-[24px]">
            <div className="flex items-center gap-[24px]">
              <div className="flex-shrink-0 relative w-[48px] h-[48px]">
                <div className="absolute inset-0 bg-[#3F56E3] rounded-full opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <LuWallet className="w-6 h-6 text-[#3F56E3]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[18px] font-bold font-['Inter'] leading-[1.2]">
                  1. Connect Your Wallet
                </p>
                <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4] mt-[8px]">
                  Connect your external wallet to start trading
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="flex-shrink-0 bg-[#3F56E3] text-white px-[16px] py-[14px] rounded-full font-medium text-[14px]
                  cursor-pointer disabled:opacity-40"
              >
                {loading ? '⏳ Connecting…' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
                <div
                  className="bg-[#26272A] border border-[#313531] rounded-[16px] overflow-hidden flex flex-col w-full"
                  data-node-id="1:14784"
                >
                  {/* Header */}
                  <div className="flex flex-col items-start justify-center overflow-clip p-[24px]">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col gap-[8px]">
                        <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                          Transfer ETH
                        </p>
                        <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                          Execute trades and manage your funds
                        </p>
                      </div>
                    
                    </div>
                  </div>
        
                  {/* Divider */}
                  <div className="h-px bg-[#313531]"></div>
        
                  {/* Form Content */}
                  <div className="flex flex-col gap-[24px] items-start justify-center overflow-clip pb-[32px] pt-[24px] px-[24px]">
                    {/* Recipient Address */}
                    <div className="flex flex-col gap-[8px] w-full">
                      <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                        Recipient Address
                      </p>
                      <div className="bg-[#212320] border border-[#313531] flex items-center overflow-clip p-[16px] rounded-[8px] w-full">
                        <input
                          type="text"
                     disabled
                          placeholder="0x or click Example Tx"
                          className="bg-transparent w-full text-white text-[14px] font-normal font-['Inter'] leading-[1.4] placeholder-[#7c847b] outline-none"
                        />
                      </div>
                     
                    </div>
        
                    {/* Amount */}
                    <div className="flex flex-col gap-[8px] w-full">
                      <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                        Amount (ETH)
                      </p>
                      <div className="bg-[#212320] border border-[#313531] flex items-center overflow-clip p-[16px] rounded-[8px] w-full">
                        <input
                          type="number"
                          disabled
                          placeholder="0.0"
                          className="bg-transparent w-full text-[#7C847B] text-[14px] font-normal font-['Inter'] leading-[1.4] placeholder-[#7c847b] outline-none"
                        />
                      </div>
                    </div>
        
                    {/* Execute Trade Button */}
                    <button  className={`flex items-center justify-center overflow-clip px-[16px] py-[14px] rounded-full w-full transition-all
               
            bg-[#3F56E30D] cursor-not-allowed
              }`}>
                     <p className='text-[14px] text-[#3F56E366]'>Connect Wallet</p>
                    </button>
                  </div>
                </div>
    </>
    )
  }

  // ── Connected — Nothing to show (Smart Account is in ConnectWallet) ──

  return null
}
