import { useEffect, useRef, useState } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import type { DisplayCurrency } from '@/types';

const CURRENCIES: { code: DisplayCurrency; flag: string; label: string }[] = [
  { code: 'NGN', flag: '🇳🇬', label: 'Nigerian Naira' },
  { code: 'USD', flag: '🇺🇸', label: 'US Dollar' },
  { code: 'GBP', flag: '🇬🇧', label: 'British Pound' },
  { code: 'CAD', flag: '🇨🇦', label: 'Canadian Dollar' },
];

interface CurrencySelectorProps {
  compact?: boolean;
  variant?: 'dark' | 'light';
}

export default function CurrencySelector({ compact = false, variant = 'dark' }: CurrencySelectorProps) {
  const displayCurrency = useCurrencyStore((s) => s.displayCurrency);
  const setDisplayCurrency = useCurrencyStore((s) => s.setDisplayCurrency);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = CURRENCIES.find((c) => c.code === displayCurrency) ?? CURRENCIES[0];
  const isLight = variant === 'light';

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Display currency"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-lg border outline-none transition-colors ${
          compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
        } ${
          isLight
            ? 'border-brand-gray-200 bg-white text-brand-accent hover:border-brand-black/30 dark:border-white/15 dark:!bg-dark-elevated dark:!text-gray-100'
            : 'border-white/20 bg-white/10 text-white hover:bg-white/15 focus:border-white/40'
        }`}
      >
        <span aria-hidden>{current.flag}</span>
        <span className="font-medium">{current.code}</span>
        <span className={`ml-0.5 ${isLight ? 'text-brand-accent/50 dark:text-gray-400' : 'text-white/70'}`}>
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Currencies"
          className={`absolute right-0 z-[80] mt-1.5 min-w-[9.5rem] overflow-hidden rounded-xl border py-1 shadow-lg ${
            isLight
              ? 'border-brand-gray-200 bg-white text-brand-black dark:border-white/15 dark:!bg-dark-elevated dark:!text-gray-100'
              : 'border-white/15 bg-brand-black text-white'
          }`}
        >
          {CURRENCIES.map((currency) => {
            const selected = currency.code === displayCurrency;
            return (
              <li key={currency.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setDisplayCurrency(currency.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                    selected
                      ? isLight
                        ? 'bg-brand-gray-100 font-semibold dark:bg-white/10'
                        : 'bg-white/15 font-semibold'
                      : isLight
                        ? 'hover:bg-brand-gray-50 dark:hover:bg-white/5'
                        : 'hover:bg-white/10'
                  }`}
                >
                  <span aria-hidden>{currency.flag}</span>
                  <span>{currency.code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
