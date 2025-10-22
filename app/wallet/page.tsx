"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { InitNexusOnConnect } from "@/components/nexus/InitNexusOnConnect";
import UnifiedBalance from "@/components/nexus/unified-balance/unified-balance";

export default function WalletPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#161823" }}>
      <InitNexusOnConnect />
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2" style={{ color: "#FBede0", fontSize: "36px" }}>
              Unified Wallet
            </h1>
            <p style={{ color: "rgba(251, 237, 224, 0.7)" }}>
              View your crypto balances across all chains in one place
            </p>
          </div>
          <ConnectButton />
        </div>

        {!isConnected ? (
          <div
            className="max-w-2xl mx-auto p-12 rounded-3xl text-center"
            style={{
              backgroundColor: "#1C1F2B",
              border: "1px solid rgba(80, 96, 108, 0.4)",
              boxShadow: "0 0 20px rgba(251, 237, 224, 0.1)",
            }}
          >
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#FBede0" }}>
              Connect Your Wallet
            </h2>
            <p className="text-lg" style={{ color: "rgba(251, 237, 224, 0.6)" }}>
              Connect your wallet to view your unified balance across multiple chains
            </p>
            <div className="mt-6 flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <UnifiedBalance />
        )}
      </div>
    </div>
  );
}
