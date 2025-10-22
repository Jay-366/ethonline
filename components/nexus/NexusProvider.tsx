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

type NexusProviderConfig = {
  network?: NexusNetwork;
  debug?: boolean;
};

const DEFAULT_NEXUS_CONFIG: Required<NexusProviderConfig> = {
  network: "mainnet",
  debug: true,
};

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

export const NexusContext = createContext<NexusContextType | undefined>(undefined);
const NexusProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: NexusProviderConfig;
}) => {
  const normalizedConfig = useMemo(
    () => ({
      network: config?.network ?? DEFAULT_NEXUS_CONFIG.network,
      debug: config?.debug ?? DEFAULT_NEXUS_CONFIG.debug,
    }),
    [config?.network, config?.debug],
  );

  const sdk = useMemo(
    () => new NexusSDK(normalizedConfig),
    [normalizedConfig.network, normalizedConfig.debug],
  );
  const [nexusSDK, setNexusSDK] = useState<NexusSDK | null>(null);
  const [supportedChainsAndTokens, setSupportedChainsAndTokens] =
    useState<SupportedChainsResult | null>(null);
  const [unifiedBalance, setUnifiedBalance] = useState<UserAsset[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [intent, setIntent] = useState<OnIntentHookData | null>(null);
  const [allowance, setAllowance] = useState<OnAllowanceHookData | null>(null);

  const initializeNexus = useCallback(
    async (provider: EthereumProvider) => {
      setLoading(true);
      try {
        if (sdk.isInitialized()) {
          throw new Error("Nexus is already initialized");
        }
        await sdk.initialize(provider);
        setNexusSDK(sdk);
        const unifiedBalanceResult = await sdk.getUnifiedBalances();
        setUnifiedBalance(unifiedBalanceResult);
        const supportedChainsResult = sdk.utils?.getSupportedChains(
          normalizedConfig.network === "testnet" ? 0 : undefined,
        );
        setSupportedChainsAndTokens(supportedChainsResult ?? null);
      } catch (error) {
        console.error("Error initializing Nexus:", error);
      } finally {
        setLoading(false);
      }
    },
    [sdk, normalizedConfig.network],
  );

  const deinitializeNexus = useCallback(async () => {
    try {
      if (!sdk.isInitialized()) {
        throw new Error("Nexus is not initialized");
      }
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
      const unifiedBalanceResult = await sdk.getUnifiedBalances();
      setUnifiedBalance(unifiedBalanceResult);
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
      network: normalizedConfig.network,
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
      normalizedConfig.network,
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
  if (!context) {
    throw new Error("useNexus must be used within a NexusProvider");
  }
  return context;
}

export function useOptionalNexus() {
  return useContext(NexusContext);
}

export default NexusProvider;
