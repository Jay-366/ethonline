"use client";

import * as React from "react";
import { useOptionalNexus } from "../nexus/NexusProvider";
import { Label } from "../ui/label";
import { DollarSign } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Separator } from "../ui/separator";

const UnifiedBalance: React.FC = () => {
  const context = useOptionalNexus();
  const unifiedBalance = context?.unifiedBalance ?? null;
  const loading = context?.loading ?? false;
  const fetchUnifiedBalance = context?.fetchUnifiedBalance;

  React.useEffect(() => {
    if (!context || unifiedBalance || !fetchUnifiedBalance) {
      return;
    }

    let cancelled = false;

    fetchUnifiedBalance().catch((error) => {
      if (!cancelled) {
        console.error("Failed to fetch unified balances:", error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [context, fetchUnifiedBalance, unifiedBalance]);

  const formatBalance = React.useCallback(
    (balance: string, decimals: number) => {
      const num = parseFloat(balance);
      return num.toFixed(Math.min(6, decimals));
    },
    []
  );

  const totalFiat = React.useMemo(() => {
    if (!unifiedBalance) return "0.00";

    const total = unifiedBalance.reduce(
      (acc, asset) => {
        const fiatValue =
          typeof asset.balanceInFiat === "number"
            ? asset.balanceInFiat
            : parseFloat(String(asset.balanceInFiat ?? 0));
        return acc + (Number.isFinite(fiatValue) ? fiatValue : 0);
      },
      0
    );

    return total.toFixed(2);
  }, [unifiedBalance]);

  const tokens = React.useMemo(() => {
    return (unifiedBalance ?? []).filter(
      (token) => parseFloat(token.balance) > 0
    );
  }, [unifiedBalance]);

  if (!context) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 rounded-lg border border-border bg-gradient-to-br from-card/50 to-card/30 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-muted/30">
            <DollarSign className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Connect your wallet to view unified balances
          </p>
        </div>
      </div>
    );
  }

  if (loading && !unifiedBalance) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 rounded-lg border border-border bg-gradient-to-br from-card/50 to-card/30 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-primary/20 animate-pulse">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Loading unified balances...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 flex flex-col gap-y-4 items-center overflow-y-scroll max-h-[400px] rounded-lg border border-border bg-gradient-to-br from-card/50 to-card/30">
      <div className="flex items-center justify-between w-full p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <DollarSign className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Total Balance
            </Label>
            <Label className="text-2xl font-bold text-foreground block">
              ${totalFiat}
            </Label>
          </div>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {tokens.map((token) => {
          const positiveBreakdown = token.breakdown.filter(
            (chain) => parseFloat(chain.balance) > 0
          );
          const chainsCount = positiveBreakdown.length;
          const chainsLabel =
            chainsCount > 1 ? `${chainsCount} chains` : `${chainsCount} chain`;
          return (
            <AccordionItem
              key={token.symbol}
              value={token.symbol}
              className="px-0"
            >
              <AccordionTrigger
                className="hover:no-underline cursor-pointer items-center p-4 rounded-lg hover:bg-accent/5 transition-colors duration-200"
                hideChevron={false}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 p-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                      {token.icon && (
                        <img
                          src={token.icon}
                          alt={token.symbol}
                          className="rounded-full w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          width="32"
                          height="32"
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground text-base">{token.symbol}</h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {chainsLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-bold text-foreground">
                        {formatBalance(token.balance, 6)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        ${token.balanceInFiat.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 py-2 px-2">
                  {positiveBreakdown.map((chain, index) => (
                    <React.Fragment key={chain.chain.id}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <div className="relative h-8 w-8 p-0.5 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30">
                            <img
                              src={chain?.chain?.logo}
                              alt={chain.chain.name}
                              sizes="100%"
                              className="rounded-full w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                              width="24"
                              height="24"
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground">{chain.chain.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            {formatBalance(chain.balance, chain.decimals)}
                          </p>
                          <p className="text-xs font-semibold text-primary">
                            ${chain.balanceInFiat.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {index < positiveBreakdown.length - 1 && (
                        <Separator className="my-1 bg-border/50" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default React.memo(UnifiedBalance);
