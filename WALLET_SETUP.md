# Wallet Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following content:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## Getting WalletConnect Project ID

1. Visit [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Sign up or log in to your account
3. Create a new project
4. Copy the Project ID
5. Replace `your_walletconnect_project_id_here` in the `.env.local` file with your actual Project ID

## Current Status

✅ Basic wallet button added to navbar
✅ Styling matches navbar design
✅ Web3 dependencies installed
✅ Providers setup ready
⏳ Full RainbowKit integration pending (requires Project ID)

## Next Steps

1. Add your WalletConnect Project ID to `.env.local`
2. Uncomment the providers in `app/layout.tsx`
3. Replace `SimpleWalletButton` with `ConnectWalletButton` in `components/layout/Navbar.tsx`
4. Test wallet connection functionality
