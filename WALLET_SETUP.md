# Wallet & Nexus SDK Setup Guide

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

✅ **Wallet Integration Complete**
- Custom wallet button in navbar with your design
- RainbowKit integration with full wallet support
- Automatic wallet connection handling

✅ **Nexus SDK Integration Complete**
- NexusProvider integrated into app providers
- Automatic Nexus initialization on wallet connect
- Updated wallet components to use NexusProvider
- Unified balance fetching capabilities
- Event hooks for intents and allowances

✅ **Components Available**
- `ConnectWalletButton` - Custom styled wallet connection
- `InitNexusOnConnect` - Automatic Nexus initialization
- `NexusStatus` - Status display component
- `InitButton` - Manual Nexus initialization
- `DeinitButton` - Nexus deinitialization
- `FetchUnifiedBalanceButton` - Balance fetching

## How It Works

1. **Wallet Connection**: User clicks "Connect Wallet" in navbar
2. **Automatic Initialization**: `InitNexusOnConnect` detects wallet connection and initializes Nexus SDK
3. **Unified Balance**: Nexus SDK fetches unified balances across all supported chains
4. **Event Hooks**: Intents and allowances are automatically tracked

## Testing the Integration

1. Add your WalletConnect Project ID to `.env.local`
2. Start the development server: `npm run dev`
3. Connect a wallet using the navbar button
4. Check the browser console for Nexus initialization logs
5. Use the wallet components to test functionality

## Available Wallet Components

- **Navbar**: Custom wallet button with your design
- **Settings Page**: Can add Nexus status and control components
- **Wallet Page**: Can display unified balances and transactions
