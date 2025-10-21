"use client";
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

interface SimpleNexusContextType {
  nexusSDK: NexusSDK | null;
  unifiedBalance: UserAsset[] | null;
  initializeNexus: (provider: EthereumProvider) => Promise<void>;
  deinitializeNexus: () => Promise<void>;
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

export const SimpleNexusContext = createContext<SimpleNexusContextType | undefined>(undefined);

const SimpleNexusProvider = ({
  children,
  config = {
    network: "mainnet",
    debug: true,
  },
}: {
  children: React.ReactNode;
  config?: {
    network?: NexusNetwork;
    debug?: boolean;
  };
}) => {
  const [nexusSDK, setNexusSDK] = useState<NexusSDK | null>(null);
  const [supportedChainsAndTokens, setSupportedChainsAndTokens] =
    useState<SupportedChainsResult | null>(null);
  const [unifiedBalance, setUnifiedBalance] = useState<UserAsset[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [intent, setIntent] = useState<OnIntentHookData | null>(null);
  const [allowance, setAllowance] = useState<OnAllowanceHookData | null>(null);

  const initializeNexus = async (provider: EthereumProvider) => {
    setLoading(true);
    try {
      console.log('Initializing Nexus SDK...');
      const sdk = new NexusSDK(config);
      await sdk.initialize(provider);
      setNexusSDK(sdk);
      console.log('Nexus SDK initialized successfully');
    } catch (error) {
      console.error("Error initializing Nexus:", error);
    } finally {
      setLoading(false);
    }
  };

  const deinitializeNexus = async () => {
    try {
      if (nexusSDK) {
        await nexusSDK.deinit();
        setNexusSDK(null);
      }
    } catch (error) {
      console.error("Error deinitializing Nexus:", error);
    }
  };

  const handleInit = useCallback(
    async (provider: EthereumProvider) => {
      if (nexusSDK) {
        console.log("Nexus already initialized");
        return;
      }
      await initializeNexus(provider);
    },
    [nexusSDK],
  );

  const fetchUnifiedBalance = async () => {
    try {
      if (nexusSDK) {
        const unifiedBalance = await nexusSDK.getUnifiedBalances();
        setUnifiedBalance(unifiedBalance);
      }
    } catch (error) {
      console.error("Error fetching unified balance:", error);
    }
  };

  const value = useMemo(
    () => ({
      nexusSDK,
      initializeNexus,
      deinitializeNexus,
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
      intent,
      setIntent,
      allowance,
      setAllowance,
      handleInit,
      supportedChainsAndTokens,
      unifiedBalance,
      config,
      loading,
      fetchUnifiedBalance,
    ],
  );
  return (
    <SimpleNexusContext.Provider value={value}>{children}</SimpleNexusContext.Provider>
  );
};

export function useSimpleNexus() {
  const context = useContext(SimpleNexusContext);
  if (!context) {
    throw new Error("useSimpleNexus must be used within a SimpleNexusProvider");
  }
  return context;
}

export function useOptionalSimpleNexus() {
  return useContext(SimpleNexusContext);
}

export default SimpleNexusProvider;
