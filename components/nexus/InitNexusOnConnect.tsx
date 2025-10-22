import { useEffect } from "react"
import { useAccount } from "wagmi"
import { EthereumProvider } from "@avail-project/nexus-core"
import { useNexus } from "@/components/nexus/NexusProvider"

export function InitNexusOnConnect() {
  const { status, connector } = useAccount()
  const { handleInit } = useNexus()

  useEffect(() => {
    if (status === "connected") {
      connector?.getProvider().then((p) => handleInit(p as EthereumProvider))
    }
  }, [status])

  return null
}