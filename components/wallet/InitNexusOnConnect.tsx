'use client';

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { EthereumProvider } from "@avail-project/nexus-core";
import { useNexus } from "@/components/nexus/NexusProvider";

const InitNexusOnConnect = () => {
  const { status, connector } = useAccount();
  const { handleInit } = useNexus();

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
