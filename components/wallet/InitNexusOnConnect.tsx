'use client';

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { EthereumProvider } from "@avail-project/nexus-core";
import { useSimpleNexus } from "@/components/nexus/SimpleNexusProvider";

const InitNexusOnConnect = () => {
  const { status, connector } = useAccount();
  const { handleInit } = useSimpleNexus();

  useEffect(() => {
    if (status !== "connected") {
      return;
    }

    connector
      ?.getProvider()
      .then((provider) => handleInit(provider as EthereumProvider))
      .catch((error) => {
        console.error("Failed to initialize Nexus provider:", error);
      });
  }, [status, connector, handleInit]);

  return null;
};

export default InitNexusOnConnect;
