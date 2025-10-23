"use client";
import "@/lib/global-polyfills";
import "@/lib/buffer-polyfill";

import {
  type EthereumProvider,
  type NexusNetwork,
  NexusSDK,
  type OnAllowanceHookData,
  type OnIntentHookData,
  type SupportedChainsResult,
  type UserAsset,
} from "@avail-project/nexus-core";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface NexusContextType {
  nexusSDK: NexusSDK | null;
  unifiedBalance: UserAsset[] | null;
  initializeNexus: (provider: EthereumProvider) => Promise<void>;
  deinitializeNexus: () => Promise<void>;
  attachEventHooks: () => void;
  intent: OnIntentHookData | null;
  setIntent: React.Dispatch<React.SetStateAction<OnIntentHookData | null>>;
  allowance: OnAllowanceHookData | null;
  setAllowance: React.Dispatch<
    React.SetStateAction<OnAllowanceHookData | null>
  >;
  handleInit: (provider: EthereumProvider) => Promise<void>;
  supportedChainsAndTokens: SupportedChainsResult | null;
  network?: NexusNetwork;
  loading: boolean;
  fetchUnifiedBalance: () => Promise<void>;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

const NexusProvider = ({
  children,
  config = {
    network: "testnet",
    debug: true,
  },
}: {
  children: React.ReactNode;
  config?: {
    network?: NexusNetwork;
    debug?: boolean;
  };
}) => {
  const sdk = useMemo(() => new NexusSDK(config), [config]);
  const [nexusSDK, setNexusSDK] = useState<NexusSDK | null>(null);
  const [supportedChainsAndTokens, setSupportedChainsAndTokens] =
    useState<SupportedChainsResult | null>(null);
  const [unifiedBalance, setUnifiedBalance] = useState<UserAsset[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [intent, setIntent] = useState<OnIntentHookData | null>(null);
  const [allowance, setAllowance] = useState<OnAllowanceHookData | null>(null);

  const initializeNexus = useCallback(async (provider: EthereumProvider) => {
    setLoading(true);
    try {
      if (sdk.isInitialized()) throw new Error("Nexus is already initialized");
      await sdk.initialize(provider);
      setNexusSDK(sdk);
      const unifiedBalance = await sdk?.getUnifiedBalances();
      setUnifiedBalance(unifiedBalance);
      const supportedChainsAndTokens = sdk?.utils?.getSupportedChains(
        config?.network === "testnet" ? 0 : undefined,
      );
      setSupportedChainsAndTokens(supportedChainsAndTokens);
    } catch (error) {
      console.error("Error initializing Nexus:", error);
    } finally {
      setLoading(false);
    }
  }, [sdk, config?.network]);

  const deinitializeNexus = useCallback(async () => {
    try {
      if (!sdk.isInitialized()) throw new Error("Nexus is not initialized");
      await sdk.deinit();
      setNexusSDK(null);
    } catch (error) {
      console.error("Error deinitializing Nexus:", error);
    }
  }, [sdk]);

  const attachEventHooks = useCallback(() => {
    sdk.setOnAllowanceHook((data: OnAllowanceHookData) => {
      setAllowance(data);
    });

    sdk.setOnIntentHook((data) => {
      setIntent(data);
    });
  }, [sdk]);

  const handleInit = useCallback(
    async (provider: EthereumProvider) => {
      if (sdk.isInitialized()) {
        console.log("Nexus already initialized");
        return;
      }
      await initializeNexus(provider);
      attachEventHooks();
    },
    [sdk, initializeNexus, attachEventHooks],
  );

  const fetchUnifiedBalance = useCallback(async () => {
    try {
      // Check if SDK is initialized before calling getUnifiedBalances
      if (!sdk || !sdk.isInitialized()) {
        console.log("Nexus SDK not initialized, cannot fetch unified balance");
        return;
      }
      const unifiedBalance = await sdk.getUnifiedBalances();
      setUnifiedBalance(unifiedBalance);
    } catch (error) {
      console.error("Error fetching unified balance:", error);
    }
  }, [sdk]);

  const value = useMemo(
    () => ({
      nexusSDK,
      initializeNexus,
      deinitializeNexus,
      attachEventHooks,
      intent,
      setIntent,
      allowance,
      setAllowance,
      handleInit,
      supportedChainsAndTokens,
      unifiedBalance,
      network: config?.network,
      loading,
      fetchUnifiedBalance,
    }),
    [
      nexusSDK,
      initializeNexus,
      deinitializeNexus,
      attachEventHooks,
      intent,
      setIntent,
      allowance,
      setAllowance,
      handleInit,
      supportedChainsAndTokens,
      unifiedBalance,
      config?.network,
      loading,
      fetchUnifiedBalance,
    ],
  );
  
  return (
    <NexusContext.Provider value={value}>{children}</NexusContext.Provider>
  );
};

export function useNexus() {
  const context = useContext(NexusContext);
  if (context === undefined) {
    throw new Error("useNexus must be used within a NexusProvider");
  }
  return context;
}

export default NexusProvider;
