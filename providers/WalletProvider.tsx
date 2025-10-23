"use client";

import "@/lib/polyfills/node-shim";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia, baseSepolia, arbitrumSepolia, monadTestnet, polygonAmoy, optimismSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NexusProvider from "@/components/nexus/NexusProvider";

const config = getDefaultConfig({
  appName: "Nexus Demo",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia, baseSepolia, arbitrumSepolia, monadTestnet, polygonAmoy, optimismSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme()}>
        <NexusProvider>
          {children}
        </NexusProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
