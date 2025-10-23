import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SUPPORTED_CHAINS_IDS } from "@avail-project/nexus-core";
import { cn } from "@/lib/utils";
import { useNexus } from "@/components/nexus/NexusProvider";

interface ChainSelectProps {
  selectedChain: number;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  label?: string;
  handleSelect: (chainId: SUPPORTED_CHAINS_IDS) => void;
}

const ChainSelect: React.FC<ChainSelectProps> = ({
  selectedChain,
  disabled,
  hidden = false,
  className,
  label,
  handleSelect,
}) => {
  const { supportedChainsAndTokens } = useNexus();

  const selectedChainData = React.useMemo(() => {
    if (!supportedChainsAndTokens) return null;
    return supportedChainsAndTokens.find((c) => c.id === selectedChain);
  }, [selectedChain, supportedChainsAndTokens]);

  if (hidden) return null;
  return (
    <Select
      value={selectedChain?.toString() ?? ""}
      onValueChange={(value) => {
        if (!disabled) {
          handleSelect(parseInt(value) as SUPPORTED_CHAINS_IDS);
        }
      }}
    >
      <div className="flex flex-col items-start gap-y-1 w-full">
        {label && <Label className="text-sm font-semibold">{label}</Label>}
        <SelectTrigger disabled={disabled} className=" w-full">
          <SelectValue>
            {selectedChainData && (
              <div
                className={cn("flex items-center gap-x-2 w-full", className)}
              >
                <img
                  src={selectedChainData?.logo}
                  alt={selectedChainData?.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p className="text-primary test-sm">
                  {selectedChainData?.name}
                </p>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
      </div>

      <SelectContent>
        <SelectGroup>
          {supportedChainsAndTokens &&
            supportedChainsAndTokens.map((chain) => {
              return (
                <SelectItem key={chain.id} value={String(chain.id)}>
                  <div className="flex items-center gap-x-2 my-1">
                    <img
                      src={chain.logo}
                      alt={chain?.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <p className="text-primary test-sm">{chain.name}</p>
                  </div>
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChainSelect;
