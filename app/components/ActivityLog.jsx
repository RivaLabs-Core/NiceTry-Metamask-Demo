'use client'
import checkIcon from "../asset/BiCheck.svg"
import walletIcon from "../asset/LuWallet.svg"
import Image from "next/image";
import plusIcon from "../asset/plus.svg"
import checkBoldIcon from "../asset/boldCheck.svg"
import rightArrowIcon from "../asset/BiRightArrowAlt.svg"
import arrowBackIcon from "../asset/BiArrowBack.svg";
import checkCircleIcon from "../asset/BsCheck2Circle.svg";


function ProgressStepCard({ name, step, state = "Next", onClick }) {
  const isComplete = state === "Complete"
  const isCurrent = state === "Current"

  if (isComplete) {
    return (
      <div
        onClick={onClick}
        className="flex-1 bg-[rgba(0,209,160,0.2)] border border-[#00d1a0] rounded-[8px] p-[12px] flex flex-col gap-[8px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <p className="text-[#00d1a0] text-[12px] font-normal font-['Inter'] leading-[1.2]">
          {step}
        </p>
        <Image src={checkIcon} alt="complete" className="w-[16px] h-[16px]" />
      </div>
    )
  }

  if (isCurrent) {
    return (
      <div className="flex-1 bg-[#353b35] border border-[#4f564f] rounded-[8px] p-[12px] flex flex-col gap-[8px] items-center justify-center">
        <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
          {step}
        </p>
        <p className="text-[#f9faf9] text-[12px] font-bold font-['Inter'] text-center leading-[1.2]">
          {name}
        </p>
      </div>
    )
  }

  // Next state
  return (
    <div className="flex-1 bg-[#26272A] border border-[#313531] rounded-[8px] p-[12px] flex flex-col gap-[8px] items-center justify-center">
      <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
        {step}
      </p>
      <p className="text-[#7c847b] text-[12px] font-bold font-['Inter'] text-center leading-[1.2]">
        {name}
      </p>
    </div>
  )
}

function Step1({ onNext }) {
  return (
    <div className="bg-[#26272A] border border-[#313531] rounded-[16px] p-[24px] w-full flex gap-[16px] items-start">
      <div className="relative shrink-0 size-[48px] flex-shrink-0">
        <div className="absolute bg-[#3F56E333] left-0 rounded-full size-[48px] top-0" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]">
          <Image alt="wallet" src={walletIcon} className="w-full h-full" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <h3 className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
          Open your external wallet app
        </h3>
        <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
          Launch your wallet application.
        </p>
      </div>
      <div className="flex flex-col gap-[16px] items-end justify-between h-[74px] shrink-0">
        <div className="bg-[rgba(161,166,160,0.2)] px-[12px] py-[12px] rounded-full">
          <p className="text-[#a1a6a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">Step 1</p>
        </div>
        <button onClick={onNext} className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
          <p className="text-[#3F56E3] text-[14px] font-medium font-['Inter'] leading-[1.2] underline">Next Step</p>
          <Image src={rightArrowIcon} alt="arrow" className="w-[20px] h-[20px]" />
        </button>
      </div>
    </div>
  )
}

function Step2({ address, originalAddress }) {
  return (
    <div className="bg-[#26272A] border border-[#313531] rounded-[16px] p-[24px] w-full flex gap-[16px] items-center">
      {/* Icon */}
      <div className="relative shrink-0 size-[48px] flex-shrink-0">
        <div className="absolute bg-[#3F56E333] left-0 rounded-full size-[48px] top-0" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]">
          <Image alt="plus" src={plusIcon} className="w-full h-full" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-[8px]">
        <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
          Create a new account inside the wallet
        </p>
        <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
          Open your MetaMask extension, click on the account selector at the top, then tap "Add account" . Once created, connect to the dApp with the new account.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-[16px] items-end justify-center h-auto shrink-0">
        <div className="bg-[rgba(161,166,160,0.2)] px-[12px] py-[12px] rounded-full">
          <p className="text-[#a1a6a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">Step 2</p>
        </div>
        <button className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
          <p className="text-[#3F56E3] text-[14px] font-medium font-['Inter'] leading-[1.2] underline">Next Step</p>
          <Image src={rightArrowIcon} alt="arrow" className="w-[20px] h-[20px]" />
        </button>
      </div>
    </div>
  )
}

function Step3({ address, originalAddress }) {
  return (
    <div className="bg-[#26272A] border border-[#313531] rounded-[16px] p-[24px] w-full flex gap-[16px] items-center">
      {/* Icon */}
      <div className="relative shrink-0 size-[48px] flex-shrink-0">
        <div className="absolute bg-[#3F56E333] left-0 rounded-full size-[48px] top-0" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]">
          <Image alt="arrow-back" src={arrowBackIcon} className="w-full h-full" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-[8px]">
        <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
          Switch back to your original account
        </p>
        <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
          After creating the new account, switch back to your previous account
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-[16px] items-end justify-center h-auto shrink-0">
        <div className="bg-[rgba(161,166,160,0.2)] px-[12px] py-[12px] rounded-full">
          <p className="text-[#a1a6a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">Step 3</p>
        </div>
        <button  className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
          <p className="text-[#3F56E3] text-[14px] font-medium font-['Inter'] leading-[1.2] underline">Next Step</p>
          <Image src={rightArrowIcon} alt="arrow" className="w-[20px] h-[20px]" />
        </button>
      </div>
    </div>
  )
}

function Step4({ onExecute, loading }) {
  return (
    <div className="bg-[#26272A] border border-[#313531] rounded-[16px] p-[24px] w-full flex gap-[16px] items-center">
      {/* Icon */}
      <div className="relative shrink-0 size-[48px] flex-shrink-0">
        <div className="absolute bg-[#3F56E333] left-0 rounded-full size-[48px] top-0" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]">
          <Image alt="check-circle" src={checkCircleIcon} className="w-full h-full" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-[8px]">
        <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
          Press "Execute" to confirm
        </p>
        <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
          Now you can sign the Smart contract Transaction and executing the trade
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-[16px] items-end justify-center h-auto shrink-0">
        <div className="bg-[rgba(161,166,160,0.2)] px-[12px] py-[12px] rounded-full">
          <p className="text-[#a1a6a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">Step 4</p>
        </div>
        <button
          onClick={onExecute}
          disabled={loading}
          className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          <p className="text-[#3F56E3] text-[14px] font-medium font-['Inter'] leading-[1.2] underline">
            {loading ? '⏳ Executing…' : 'Ready to Trade!'}
          </p>
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════

export function ActivityLog({
  isConnected,
  address,
  originalAddress,
  pool,
  currentStep,
  onSetStep,
  onExecute,
  loading,
}) {
  const progress = Math.round((currentStep / 4) * 100)

  const stepState = (idx) => {
    if (idx < currentStep) return 'Complete'
    if (idx === currentStep) return 'Current'
    return 'Next'
  }

  // Clicking on a completed step goes back to that step
  const handleStepClick = (idx) => {
    if (idx < currentStep) onSetStep(idx)
  }

  // ── Not connected ─────────────────────────────────────────────────────────

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-[24px] w-full" data-node-id="1:2379">
        <div className="bg-[#26272A] border border-[#313531] rounded-[16px] overflow-hidden flex flex-col w-full" data-node-id="1:2518">
          <div className="flex items-center justify-between p-[24px]" data-node-id="1:2519">
            <h2 className="text-[#f9faf9] text-[18px] font-bold font-['Inter']">Activity Log</h2>
            <button className="text-[#7c847b] text-[14px] font-medium opacity-0 cursor-pointer hover:opacity-100 transition-opacity">
              Clear
            </button>
          </div>
          <div className="h-px bg-[#313531]"></div>
          <div className="flex flex-col p-[24px] pb-[32px]" data-node-id="1:2527">
            <div className="flex flex-col gap-[8px]" data-node-id="1:2528">
              <p className="text-[#7c847b] text-[14px] font-bold font-['Inter'] leading-[1.4]">
                Awaiting initialization…
              </p>
              <p className="text-[#7c847b] text-[14px] font-normal font-['Inter'] leading-[1.4]">
                Click &quot;Connect Wallet&quot; to begin
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Connected — Create Signer wizard ──────────────────────────────────────

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div className="bg-[#26272A] border border-[#313531] rounded-[16px] flex flex-col gap-[24px] p-[24px] w-full">
        <p className="text-[#f9faf9] text-[18px] font-bold font-['Inter'] leading-[1.2]">
          Create Signer
        </p>

        {/* Progress Info */}
        <div className="flex flex-col gap-[8px] w-full">
          <div className="flex items-center justify-between">
            <p className="text-[#7c847b] text-[12px] font-normal font-['Inter'] leading-[1.2]">
              Step {Math.min(currentStep + 1, 4)} of 4
            </p>
            <p className="text-[#00d1a0] text-[12px] font-normal font-['Inter'] leading-[1.2]">
              {progress}% Complete
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-[#181b18] rounded-[8px] h-[8px] w-full overflow-hidden">
            <div
              className="bg-[#00d1a0] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Cards — clickable to go back */}
        <div className="flex gap-[12px] w-full">
          <ProgressStepCard step="Step 1" name="Open"       state={stepState(0)} onClick={() => handleStepClick(0)} />
          <ProgressStepCard step="Step 2" name="Create New" state={stepState(1)} onClick={() => handleStepClick(1)} />
          <ProgressStepCard step="Step 3" name="Switch"     state={stepState(2)} onClick={() => handleStepClick(2)} />
          <ProgressStepCard step="Step 4" name="Ready!"     state={stepState(3)} onClick={() => handleStepClick(3)} />
        </div>
      </div>

      {/* Step Detail Views */}
      {currentStep === 0 && <Step1 onNext={() => onSetStep(1)} />}
      {currentStep === 1 && <Step2 address={address} originalAddress={originalAddress} />}
      {currentStep === 2 && <Step3 address={address} originalAddress={originalAddress} />}
      {currentStep === 3 && <Step4 onExecute={onExecute} loading={loading} />}

      {/* Completed Steps */}
      {currentStep > 0 && (
        <div className="flex flex-col gap-[24px] w-full">
          {currentStep > 0 && (
            <div className="bg-[rgba(0,209,160,0.2)] border border-[#00d1a0] flex gap-[16px] items-center opacity-40 p-[24px] w-full rounded-[16px]">
              <div className="relative shrink-0 size-[48px]">
                <div className="absolute bg-[rgba(0,209,160,0.4)] left-0 rounded-full size-[48px] top-0" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[20px]">
                  <Image alt="check" src={checkBoldIcon} className="w-full h-full" />
                </div>
              </div>
              <p className="text-[#00d1a0] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                Open your external wallet app
              </p>
              <div className="bg-[rgba(0,209,160,0.2)] px-[12px] py-[12px] rounded-full ml-auto">
                <p className="text-[#00d1a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">
                  Step 1
                </p>
              </div>
            </div>
          )}
          {currentStep > 1 && (
            <div className="bg-[rgba(0,209,160,0.2)] border border-[#00d1a0] flex gap-[16px] items-center opacity-40 p-[24px] w-full rounded-[16px]">
              <div className="relative shrink-0 size-[48px]">
                <div className="absolute bg-[rgba(0,209,160,0.4)] left-0 rounded-full size-[48px] top-0" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[20px]">
                  <Image alt="check" src={checkBoldIcon} className="w-full h-full" />
                </div>
              </div>
              <p className="text-[#00d1a0] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                Create a new account inside the wallet
              </p>
              <div className="bg-[rgba(0,209,160,0.2)] px-[12px] py-[12px] rounded-full ml-auto">
                <p className="text-[#00d1a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">
                  Step 2
                </p>
              </div>
            </div>
          )}
          {currentStep > 2 && (
            <div className="bg-[rgba(0,209,160,0.2)] border border-[#00d1a0] flex gap-[16px] items-center opacity-40 p-[24px] w-full rounded-[16px]">
              <div className="relative shrink-0 size-[48px]">
                <div className="absolute bg-[rgba(0,209,160,0.4)] left-0 rounded-full size-[48px] top-0" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[20px]">
                  <Image alt="check" src={checkBoldIcon} className="w-full h-full" />
                </div>
              </div>
              <p className="text-[#00d1a0] text-[18px] font-bold font-['Inter'] leading-[1.2]">
                Switch back to your original account
              </p>
              <div className="bg-[rgba(0,209,160,0.2)] px-[12px] py-[12px] rounded-full ml-auto">
                <p className="text-[#00d1a0] text-[12px] font-bold font-['Inter'] leading-[1.2]">
                  Step 3
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
