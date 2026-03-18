import React, { useEffect, useState } from 'react';
import { recurringApi, authApi } from '../../utils/api';
import AppButton from './AppButton';

const RecurringSettings: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!authApi.isAuthenticated()) return;

    recurringApi
      .getSettings()
      .then((settings) => {
        setEnabled(settings.enabled);
        setAmount(settings.amount || '');
        setFrequency(settings.frequency || 'weekly');
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await recurringApi.updateSettings(enabled, amount, frequency);
      setStatus('Settings saved');
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      setStatus(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!authApi.isAuthenticated()) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        Sign in to manage recurring deposits
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Recurring Deposit
      </h3>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">Enable auto-deposit</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-secondary border border-border'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
              enabled ? 'translate-x-5 bg-primary-foreground' : 'translate-x-0 bg-muted-foreground'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
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
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </>
      )}

      <AppButton variant="secondary" onClick={handleSave} isLoading={saving} className="w-full">
        Save Settings
      </AppButton>

      {status && <p className="text-xs text-primary text-center">{status}</p>}

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        When a recurring deposit is due, you'll be prompted to confirm the transaction in your wallet.
      </p>
    </div>
  );
};

export default RecurringSettings;
