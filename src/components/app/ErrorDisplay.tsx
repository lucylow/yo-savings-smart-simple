import React from 'react';

interface ErrorDisplayProps {
  error: Error | string | any;
  onRetry?: () => void;
  retryLabel?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  'user rejected': 'Transaction was cancelled by user.',
  'insufficient funds': 'Insufficient funds in your wallet.',
  'insufficient balance': 'Your vault balance is too low.',
  'network mismatch': 'Please switch to the correct network.',
  'execution reverted': 'Transaction failed on-chain. The vault may have insufficient liquidity.',
  'nonce too low': 'Please wait for your pending transaction to complete.',
  'gas required exceeds': 'Transaction would fail. Check your balance and try a smaller amount.',
};

function parseError(error: any): string {
  const raw = typeof error === 'string' ? error : error?.message || error?.reason || 'An unexpected error occurred';
  const lower = raw.toLowerCase();

  for (const [key, friendly] of Object.entries(ERROR_MESSAGES)) {
    if (lower.includes(key)) return friendly;
  }

  // Truncate long error messages
  if (raw.length > 120) return raw.slice(0, 120) + '...';
  return raw;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, retryLabel = 'Retry' }) => {
  if (!error) return null;

  const message = parseError(error);

  return (
    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
      <div className="flex items-start gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-destructive mt-0.5 flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-destructive leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[10px] text-destructive font-medium underline hover:no-underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
