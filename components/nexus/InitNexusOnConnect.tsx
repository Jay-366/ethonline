import { useEffect, useRef } from "react"
import { useAccount } from "wagmi"
import { EthereumProvider } from "@avail-project/nexus-core"
import { useNexus } from "@/components/nexus/NexusProvider"

export function InitNexusOnConnect() {
  const { status, connector } = useAccount()
  const { handleInit, loading, nexusSDK } = useNexus()
  const initializingRef = useRef(false)
  const hasAttemptedRef = useRef(false)

  useEffect(() => {
    if (status !== "connected") {
      hasAttemptedRef.current = false
      return
    }

    if (!connector || loading || nexusSDK || initializingRef.current || hasAttemptedRef.current) {
      return
    }

    hasAttemptedRef.current = true
    initializingRef.current = true

    let cancelled = false

    const run = async () => {
      try {
        const provider = await connector.getProvider()
        if (!cancelled && provider) {
          await handleInit(provider as EthereumProvider)
        }
      } catch (error) {
        console.error("Failed to initialize Nexus SDK:", error)
      } finally {
        initializingRef.current = false
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [status, connector, handleInit, loading, nexusSDK])

  return null
}
