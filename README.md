# NiceTry Demo Through Metamask and a dedicated webapp

> [!TIP]
> This repo covers a single demo. For the full NiceTry project see the [main repo](https://github.com/RivaLabs-Core/NiceTry) or the [docs](https://docs.nicetry.xyz/).

A demo web app that uses standard MetaMask signatures to drive NiceTry's ECDSA rotation mechanism. Please make sure to clear your cache after each demo run.

Live demo: [metamask.nicetry.xyz](https://metamask.nicetry.xyz/)

## What this is

This repo is the frontend for a single demo: showing that NiceTry's key rotation flow can be operated end-to-end from a standard wallet like MetaMask, without requiring any wallet-side changes, custom signer, or extension fork. Every signature the contract needs is produced through the normal MetaMask signing UX.

It exists to test one specific thing. It is not a product, not a reference implementation, and not representative of the final NiceTry architecture.

## Why the UX is intentionally bad

The demo works, but using it is awkward by design. You have to manually switch MetaMask accounts between rotations, keep track of which address is the current signer, and accept that every send is also a rotation. It shows the rotation mechanism itself is sound and operable with nothing more than standard ECDSA signatures, while making it obvious that bolting this onto an existing wallet is not the right long-term shape. A native implementation, where key generation, rotation, and signer handoff happen inside the wallet itself, removes the account switching and the mental overhead entirely.

## What you can do with it

Connect MetaMask on Sepolia, create a smart account, then run the core loop: send ETH to a recipient while atomically rotating the account's owner to the next signer. Each rotation is one `UserOperation` whose `callData` packs `execute(recipient, amount, 0x)` with the next owner address appended. Switch MetaMask to that new signer and rotate again. Signatures are standard viem `signMessage` / `signTypedData` calls, so MetaMask only ever shows its normal signing popup.


## Stack

Next.js (App Router), JavaScript. Deployed on Vercel.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Status

Demo only. Expect rough edges, hardcoded parameters, and code paths that exist purely to make the rotation visible in a browser. For the actual NiceTry design, rotation model, and security reasoning, see [docs.nicetry.xyz](https://docs.nicetry.xyz).
