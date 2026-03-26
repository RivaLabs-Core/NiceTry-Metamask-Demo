"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { isAddress } from 'viem'
import Image from "next/image";
import metaLogo from "../asset/metaLogo.svg"

export function ConnectWallet({
  accountAddress,
  balance,
  rotations,
  pool,
  address: ownerAddress,
  currentStep,
  recipient,
  amount,
  onRecipientChange,
  onAmountChange,
  onExecute,
  loading,
  nextOwnerInPool,
}) {
  const { isConnected, isConnecting, isReconnecting, address } = useAccount();
  const { connect, connectors } = useConnect();
  const {disconnect} = useDisconnect()

  if (isReconnecting) return <div>Reconnecting...</div>;

  // ── Stato connesso + step >= 3: Smart Account + Active Signer + Transfer ──
  if (isConnected && address && currentStep !== undefined && currentStep >= 3) {
    const ownerIndex = pool?.findIndex(
      (a) => a.toLowerCase() === address.toLowerCase()
    ) ?? 0;

    const displayBalance = balance !== null && balance !== undefined
      ? parseFloat(balance).toLocaleString()
      : "0.0";

    const rotationCount = rotations?.length ?? 0;

    const canExecute = !!nextOwnerInPool && !loading && isAddress(recipient) 
    //&& Number(amount) > 0

 
  
    return (
      <div className="flex flex-col gap-[24px] w-full">
        {/* Smart Account Card */}
        <div
          className="bg-[#26272A] border border-[#313531] rounded-[16px] overflow-hidden flex flex-col w-full"
          data-node-id="1:14721"
        >
          {/* Header with Icon and Account Info */}
          <div className="flex gap-[16px] items-center p-[24px]" data-node-id="1:14723">
            <div className="w-[40px] h-[40px] flex-shrink-0 bg-[#f6851b] rounded-full flex items-center justify-center" data-node-id="1:14724">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <div className="flex flex-col gap-[8px]" data-node-id="1:14733">
              <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                Smart Account
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4] break-all">
                {accountAddress || address}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#313531]"></div>

          {/* Stats Row */}
          <div className="flex items-stretch" data-node-id="1:14737">
            {/* Balance */}
            <div className="flex-1 flex flex-col gap-[8px] p-[16px]" data-node-id="1:14738">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Balance
              </p>
              <p className="text-[#f9faf9] text-[16px] font-bold font-['Inter'] leading-[1.2]">
                {displayBalance}
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                TKN
              </p>
            </div>

            {/* Vertical Divider 1 */}
            <div className="flex items-center">
              <div className="h-[101px] w-px bg-[#313531]"></div>
            </div>

            {/* Owner */}
            <div className="flex-1 flex flex-col gap-[8px] p-[16px]" data-node-id="1:14743">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Owner
              </p>
              <p className="text-[#f9faf9] text-[16px] font-bold font-['Inter'] leading-[1.2]">
                #{ownerIndex >= 0 ? ownerIndex : 0}
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                Index
              </p>
            </div>

            {/* Vertical Divider 2 */}
            <div className="flex items-center">
              <div className="h-[101px] w-px bg-[#313531]"></div>
            </div>

            {/* Rotated */}
            <div className="flex-1 flex flex-col gap-[8px] p-[16px]" data-node-id="1:14748">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Rotated
              </p>
              <p className="text-[#f9faf9] text-[16px] font-bold font-['Inter'] leading-[1.2]">
                {rotationCount}
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                Times
              </p>
            </div>
          </div>
        </div>

        {/* Active Signer Card */}
        
          <div
            className="bg-[#272933] border border-[#212225] rounded-[16px] flex flex-col gap-[8px] w-full p-[16px] "
            data-node-id="1:14753"
          >
            {/* Label with Icon */}
            <div className="flex items-center gap-[8px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#3F56E3]"></div>
              <p className="text-[#3F56E3] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                Active Signer
              </p>
            </div>

            {/* Current Signer Address */}
            <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4] break-all">
              {address}
            </p>
          </div>
        

        {/* Transfer Token Card — inputs cablati */}
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
              <button
                onClick={() => { onRecipientChange('0x000000000000000000000000000000000000dEaD'); onAmountChange('0.001') }}
                disabled={loading}
                className="text-[#3F56E3] text-[14px] font-medium font-['Inter'] leading-[1.2] underline whitespace-nowrap hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                Example Tx
              </button>
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
                  value={recipient}
                  onChange={(e) => onRecipientChange(e.target.value)}
                  placeholder="0x or click Example Tx"
                  className="bg-transparent w-full text-white text-[14px] font-normal font-['Inter'] leading-[1.4] placeholder-[#7c847b] outline-none"
                />
              </div>
              {recipient && !isAddress(recipient) && (
                <p className="text-[11px] text-red-400">⚠ Invalid address</p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-[8px] w-full">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Amount (ETH)
              </p>
              <div className="bg-[#212320] border border-[#313531] flex items-center overflow-clip p-[16px] rounded-[8px] w-full">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent w-full text-white text-[14px] font-normal font-['Inter'] leading-[1.4] placeholder-[#7c847b] outline-none"
                />
              </div>
            </div>

            {/* Execute Trade Button */}
            <button
              onClick={onExecute}
              disabled={!canExecute}
              className={`flex items-center justify-center overflow-clip px-[16px] py-[14px] rounded-full w-full transition-all ${
                canExecute
                  ? 'bg-[#3F56E3] cursor-pointer '
                  : 'bg-[rgba(124,207,0,0.05)] cursor-not-allowed'
              }`}
            >
              <p className={`text-[14px] font-medium font-['Inter'] leading-[1.2] ${
                canExecute ? 'text-white' : 'text-[#565656]'
              }`}>
                {loading ? '⏳ Executing…' : 'Execute Trade'}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Stato connesso + step < 3: Smart Account + Create Signer Required ─────
  if (isConnected && address) {
    const ownerIndex = pool?.findIndex(
      (a) => a.toLowerCase() === address.toLowerCase()
    ) ?? 0;

    const displayBalance = balance !== null && balance !== undefined
      ? parseFloat(balance).toLocaleString()
      : "0.0";

    const rotationCount = rotations?.length ?? 0;
    const handleDisconnect = () => {
   
    
      // Fallback: clear localStorage
      localStorage.removeItem('SmartAccount')
      localStorage.removeItem('addresses')
      localStorage.removeItem('originalAddress')
      localStorage.removeItem('expectedNextOwner')
        disconnect()
    
  }

    return (
      <div className="flex flex-col gap-[24px] w-full">
        {/* Smart Account Card */}
        <div
          className="bg-[#26272A] border border-[#313531] rounded-[16px] overflow-hidden flex flex-col w-full"
          data-node-id="1:4781"
        >
          {/* Header with Icon and Account Info */}
          <div className="flex gap-[16px] items-center p-[24px] " data-node-id="1:4782">
            <div className="w-[40px] h-[40px] flex-shrink-0  rounded-full flex items-center justify-center" data-node-id="1:4784">
            <Image src={metaLogo} alt="" className="h-full w-full"/>
            </div>
            <div className="flex flex-col w-full gap-[8px] " data-node-id="1:4793">
             <div className="w-full flex justify-between items-center">
                <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                  Smart Account
                </p>
                <button onClick={handleDisconnect} className="text-[#3F56E3] underline text-[14px] cursor-pointer">Disconnect</button>
             </div>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4] break-all">
                {accountAddress || address}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#313531]"></div>

          {/* Stats Row */}
          <div className="flex items-stretch" data-node-id="1:4797">
            {/* Balance */}
            <div className="flex-1 flex flex-col gap-[8px] p-[16px]" data-node-id="1:4798">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Balance
              </p>
              <p className="text-[#f9faf9] text-[16px] font-bold font-['Inter'] leading-[1.2]">
                {displayBalance}
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                ETH
              </p>
            </div>

            {/* Vertical Divider 1 */}
            <div className="flex items-center">
              <div className="h-[101px] w-px bg-[#313531]"></div>
            </div>

            {/* Owner */}
            <div className="flex-1 flex flex-col gap-[8px] p-[16px]" data-node-id="1:4803">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Owner
              </p>
              <p className="text-[#f9faf9] text-[16px] font-bold font-['Inter'] leading-[1.2]">
                #{ownerIndex >= 0 ? ownerIndex : 0}
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                Index
              </p>
            </div>

            {/* Vertical Divider 2 */}
            <div className="flex items-center">
              <div className="h-[101px] w-px bg-[#313531]"></div>
            </div>

            {/* Rotated */}
            <div className="flex-1 flex flex-col gap-[8px] p-[16px]" data-node-id="1:4808">
              <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
                Rotated
              </p>
              <p className="text-[#f9faf9] text-[16px] font-bold font-['Inter'] leading-[1.2]">
                {rotationCount}
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                Times
              </p>
            </div>
          </div>
        </div>

        {/* Create Signer Required */}
        <div
          className="bg-[#241E13] rounded-[16px] overflow-hidden flex flex-col w-full p-[24px]"
          data-node-id="1:4812"
        >
          <div className="flex gap-[16px] items-start w-full">
            <div className="relative shrink-0 w-[48px] h-[48px]">
              <div className="absolute left-0 top-0 w-[48px] h-[48px] bg-[#f5d939] opacity-40 rounded-full" />
              <div className="absolute left-[12px] top-[12px] w-[24px] h-[24px] bg-[#f5d939] rounded-full" />
            </div>
            
            <div className="flex-1 flex flex-col gap-[12px]">
              <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                Create Signer Required
              </p>
              
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                  To perform this operation, you need to create a new account in your external wallet first.
                </p>
                <p className="text-[#f5d939] text-[14px] font-normal font-['Inter'] leading-[1.2]">
                  Follow the Steps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Token — disabled state */}
        <div className="bg-[#26272A] border border-[#313531] rounded-[16px] flex flex-col w-full" data-node-id="1:2329">
          <div className="flex flex-col gap-[8px] items-start p-[24px] w-full">
            <p className="font-bold text-[#f9faf9] text-[18px] leading-[1.2] font-['Inter']">
              Transfer ETH
            </p>
            <p className="font-normal text-[#7c847b] text-[14px] leading-[1.4] font-['Inter']">
              Execute trades and manage your funds
            </p>
          </div>

          <div className="h-px bg-[#313531] w-full"></div>

          <div className="flex flex-col gap-[24px] p-[24px] pb-[32px] w-full">
            <div className="flex flex-col gap-[8px] w-full">
              <p className="font-normal text-[#7c847b] text-[12px] leading-[1.2] font-['Inter']">
                Recipient Address
              </p>
              <div className="bg-[#212320] border border-[#313531] rounded-[8px] p-[16px] w-full">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => onRecipientChange(e.target.value)}
                  placeholder="0x or click Example Tx"
                  className="bg-transparent w-full text-[#7c847b] text-[14px] leading-[1.4] font-['Inter'] placeholder-[#7c847b] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[8px] w-full">
              <p className="font-normal text-[#7c847b] text-[12px] leading-[1.2] font-['Inter']">
                Amount (ETH)
              </p>
              <div className="bg-[#212320] border border-[#313531] rounded-[8px] p-[16px] w-full">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent w-full text-[#7c847b] text-[14px] leading-[1.4] font-['Inter'] placeholder-[#7c847b] outline-none"
                />
              </div>
            </div>

            <button
              disabled
              className="bg-[#212225] rounded-[9999px] px-[16px] py-[14px] text-[14px] font-medium font-['Inter'] text-[#565656] cursor-not-allowed w-full"
            >
              Create Signer Required
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not connected - return null
  return null;
}