'use client'

import { useAccount, useDisconnect } from 'wagmi'
import logo from "../asset/logo.svg"
import Image from 'next/image'
const imgGroup12 = "http://localhost:3845/assets/a1d662923cb9699359798b0f8124ac1daa927eb8.svg"
const imgFrame3 = "http://localhost:3845/assets/8061bc4206b3829612bb69278124a45d7ba119d3.svg"

export const Navbar = ({ onDisconnect }) => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const handleDisconnect = () => {
    if (onDisconnect) {
      // Use parent handler if provided (handles cache cleanup)
      disconnect()
    } else {
      // Fallback: clear localStorage
      localStorage.removeItem('SmartAccount')
      localStorage.removeItem('addresses')
      localStorage.removeItem('originalAddress')
      localStorage.removeItem('expectedNextOwner')
        disconnect()
    }
  }

  return (
    <div
      className="border-b border-[#26272A] border-solid flex items-center justify-between p-[16px] bg-[#171622] relative z-100"
      data-name="navbar"
    >
      {/* Left: Logo + Brand */}
      <div className="flex gap-[8px] items-center">
        
          {/* Logo */}
          <div className="h-[24px]  w-[62.453px]">
            <Image alt="logo" className="w-full h-full brightness-200 grayscale-100" src={logo} />
          </div>
        
     
        {/* Tagline */}
        <p className="font-['Inter'] font-normal text-[#7c847b] text-[8px] uppercase tracking-normal whitespace-nowrap">
          quantum-safe Wallet
        </p>
      </div>

      {/* Right: Links and Status */}
      <div className="flex gap-[24px] items-center">
        {/* Learn More Link */}
        <a
          href="#"
          className="capitalize underline font-['Inter'] text-white text-[11px] tracking-[0.22px] whitespace-nowrap hover:text-[#3F56E3] transition-colors"
        >
          learn More
        </a>

        {/* Network Status */}
        <div className="flex gap-[8px] items-center">
          <p className="capitalize italic font-['Inter'] text-[#7c847b] text-[11px] tracking-[0.22px] whitespace-nowrap">
            Live on
          </p>
          <div className="bg-[#231df9] w-[12px] h-[12px]  flex-shrink-0" />
          <p className="capitalize font-['Inter'] font-bold text-white text-[11px] tracking-[0.22px] whitespace-nowrap">
            Sepolia
          </p>
        </div>

   
      </div>
    </div>
  )
}
