import React, { useState, useEffect } from 'react';
import { useDeposit } from '@yo-protocol/react';
import { useWallet } from '../../hooks/useWallet';
import { useVaultContext } from '../../contexts/VaultContext';
import {
  NETWORKS,
  DEPOSIT_SOURCE_NETWORKS,
  SUPPORTED_ASSETS,
  getNetworkByChainId,
  getExplorerTxUrl,
  type NetworkId,
} from '../../config/networks';
import AppButton from './AppButton';
import ErrorDisplay from './ErrorDisplay';

interface RouteInfo {
  estimatedGas?: string;
  estimatedOutput?: string;
  steps?: number;
  available: boolean;
}

const CrossChainDeposit: React.FC = () => {
  const [sourceChain, setSourceChain] = useState<NetworkId>('base');
  const [asset, setAsset] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'switching' | 'depositing' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const { account, chainId } = useWallet();
  const { selectedVault } = useVaultContext();
  const vaultId = (selectedVault as any)?.address || (selectedVault as any)?.name || '';

  const { deposit, step, isLoading, isSuccess, hash, error: depositError, reset } = useDeposit({
    vault: vaultId,
  } as any) as any;

  const currentNetwork = chainId ? getNetworkByChainId(chainId) : null;
  const isCrossChain = sourceChain !== 'base';

  // Check route when params change (debounced)
  useEffect(() => {
    if (!isCrossChain || !amount || parseFloat(amount) <= 0 || !vaultId) {
      setRouteInfo(null);
      return;
    }

    const timer = setTimeout(async () => {
      setRouteLoading(true);
      try {
        // Query Enso API for route availability
        const res = await fetch(
          `https://api.enso.finance/api/v1/shortcuts/route?` +
            `chainId=${NETWORKS[sourceChain].chainId}&` +
            `toChainId=${NETWORKS.base.chainId}&` +
            `fromAddress=${asset}&` +
            `toAddress=${vaultId}&` +
            `amountIn=${Math.floor(parseFloat(amount) * 1e18)}&` +
            `slippage=50` // 0.5% in bps
        );

        if (res.ok) {
          const data = await res.json();
          setRouteInfo({
            estimatedGas: data.gas?.toString(),
            estimatedOutput: data.amountOut?.toString(),
            steps: data.route?.length || 1,
            available: true,
          });
        } else {
          setRouteInfo({ available: false });
        }
      } catch {
        setRouteInfo({ available: false });
      } finally {
        setRouteLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [sourceChain, asset, amount, vaultId, isCrossChain]);

  // Sync txHash from SDK
  useEffect(() => {
    if (hash) setTxHash(hash);
  }, [hash]);

  useEffect(() => {
    if (isSuccess) setTxStatus('success');
  }, [isSuccess]);

  const handleSwitchNetwork = async () => {
    if (!(window as any).ethereum) return;
    setTxStatus('switching');
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS[sourceChain].chainIdHex }],
      });
    } catch (err: any) {
      // If chain not added, try adding it
      if (err.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: NETWORKS[sourceChain].chainIdHex,
                chainName: NETWORKS[sourceChain].name,
                rpcUrls: [NETWORKS[sourceChain].rpcUrl],
                nativeCurrency: {
                  name: NETWORKS[sourceChain].currency,
                  symbol: NETWORKS[sourceChain].currency,
                  decimals: 18,
                },
              },
            ],
          });
        } catch {
          setTxStatus('error');
        }
      }
    } finally {
      if (txStatus === 'switching') setTxStatus('idle');
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      setTxStatus('depositing');
      const decimals = SUPPORTED_ASSETS.find((a) => a.symbol === asset)?.decimals ?? 18;
      const amountRaw = BigInt(Math.floor(parseFloat(amount) * 10 ** decimals));
      await deposit({ amount: amountRaw });
    } catch {
      setTxStatus('error');
    }
  };

  const handleReset = () => {
    reset?.();
    setAmount('');
    setTxHash(null);
    setTxStatus('idle');
    setRouteInfo(null);
  };

  if (!account) {
    return <p className="text-xs text-muted-foreground text-center py-4">Connect wallet to deposit</p>;
  }

  const needsNetworkSwitch = currentNetwork !== sourceChain;

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Cross-Chain Deposit
      </h3>

      {/* Source chain */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
          From Network
        </label>
        <select
          value={sourceChain}
          onChange={(e) => setSourceChain(e.target.value as NetworkId)}
          className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        >
          {DEPOSIT_SOURCE_NETWORKS.map((net) => (
            <option key={net} value={net}>
              {NETWORKS[net].name} {net === 'base' ? '(Direct)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Asset */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
          Asset
        </label>
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        >
          {SUPPORTED_ASSETS.map((a) => (
            <option key={a.symbol} value={a.symbol}>
              {a.symbol} – {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary tabular-nums"
          disabled={isLoading}
          step="0.01"
          min="0"
        />
      </div>

      {/* Route info (cross-chain only) */}
      {isCrossChain && amount && parseFloat(amount) > 0 && (
        <div className="p-3 rounded-lg bg-secondary border border-border">
          {routeLoading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking route via Enso...
            </div>
          ) : routeInfo?.available ? (
            <div className="space-y-1">
              <p className="text-xs text-primary font-medium">✓ Route available</p>
              {routeInfo.steps && (
                <p className="text-[10px] text-muted-foreground">
                  {routeInfo.steps} step{routeInfo.steps > 1 ? 's' : ''} · Routed via Enso
                </p>
              )}
            </div>
          ) : routeInfo ? (
            <p className="text-xs text-muted-foreground">
              No route found. Try a different asset or amount.
            </p>
          ) : null}
        </div>
      )}

      {/* Step indicator */}
      {step && step !== 'idle' && step !== 'success' && step !== 'error' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {step === 'switching-chain' && 'Switching network...'}
          {step === 'approving' && 'Approving token...'}
          {step === 'depositing' && 'Confirming deposit...'}
          {step === 'waiting' && 'Waiting for confirmation...'}
        </div>
      )}

      {/* Success */}
      {txStatus === 'success' && (
        <div className="space-y-1.5">
          <p className="text-xs text-primary font-medium">✓ Deposit confirmed!</p>
          {txHash && (
            <a
              href={getExplorerTxUrl(sourceChain, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground underline hover:text-foreground"
            >
              View on {NETWORKS[sourceChain].name} explorer →
            </a>
          )}
          <button onClick={handleReset} className="text-[10px] text-primary underline">
            Make another deposit
          </button>
        </div>
      )}

      {/* Error */}
      {depositError && (
        <ErrorDisplay error={depositError} onRetry={handleReset} retryLabel="Try again" />
      )}

      {/* Action buttons */}
      {txStatus !== 'success' && !depositError && (
        <>
          {needsNetworkSwitch ? (
            <AppButton
              variant="secondary"
              onClick={handleSwitchNetwork}
              isLoading={txStatus === 'switching'}
              className="w-full"
            >
              Switch to {NETWORKS[sourceChain].name}
            </AppButton>
          ) : (
            <AppButton
              variant="primary"
              onClick={handleDeposit}
              isLoading={isLoading}
              className="w-full"
              disabled={!amount || parseFloat(amount) <= 0 || (isCrossChain && !routeInfo?.available)}
            >
              {isCrossChain ? `Deposit via ${NETWORKS[sourceChain].name}` : 'Deposit'}
            </AppButton>
          )}
        </>
      )}

      {isCrossChain && (
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Your deposit will be routed from {NETWORKS[sourceChain].name} to YO vaults on Base via Enso.
        </p>
      )}
    </div>
  );
};

export default CrossChainDeposit;
