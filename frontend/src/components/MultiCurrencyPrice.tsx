import type { CurrencySettings, DisplayCurrency } from '@/types';
import { convertNgnToCurrency, useCurrencyStore } from '@/store/currencyStore';
import { formatForeignPrice, formatNgnCompact, formatPrice } from '@/utils/format';

interface MultiCurrencyPriceProps {
  amountNgn: string | number;
  compareAtNgn?: string | number;
  settings: CurrencySettings;
  size?: 'sm' | 'md' | 'lg';
  /** Single-line primary price (uses selected display currency) — for product cards */
  compact?: boolean;
  className?: string;
}

function formatDisplayAmount(
  amountNgn: number,
  currency: DisplayCurrency,
  settings: CurrencySettings,
): string {
  if (currency === 'NGN') return formatNgnCompact(amountNgn);
  const converted = convertNgnToCurrency(amountNgn, currency, settings);
  return formatForeignPrice(converted, currency);
}

export default function MultiCurrencyPrice({
  amountNgn,
  compareAtNgn,
  settings,
  size = 'sm',
  compact = false,
  className = '',
}: MultiCurrencyPriceProps) {
  const displayCurrency = useCurrencyStore((s) => s.displayCurrency);
  const ngn = typeof amountNgn === 'string' ? parseFloat(amountNgn) : amountNgn;
  const compare =
    compareAtNgn === undefined || compareAtNgn === null || compareAtNgn === ''
      ? null
      : typeof compareAtNgn === 'string'
        ? parseFloat(compareAtNgn)
        : compareAtNgn;

  if (compact) {
    return (
      <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
        {compare != null && !isNaN(compare) && compare > ngn && (
          <span className="text-[11px] text-brand-accent/45 line-through dark:text-gray-500">
            {formatDisplayAmount(compare, displayCurrency, settings)}
          </span>
        )}
        <span className="text-sm font-semibold text-brand-accent dark:text-white">
          {formatDisplayAmount(ngn, displayCurrency, settings)}
        </span>
      </div>
    );
  }

  const usd = convertNgnToCurrency(ngn, 'USD', settings);
  const gbp = convertNgnToCurrency(ngn, 'GBP', settings);
  const cad = convertNgnToCurrency(ngn, 'CAD', settings);

  const primaryClass =
    size === 'lg'
      ? 'text-2xl font-semibold text-brand-accent dark:text-white'
      : size === 'md'
        ? 'text-lg font-semibold text-brand-accent dark:text-white'
        : 'text-sm font-semibold text-brand-accent dark:text-white';

  const secondaryClass =
    size === 'lg'
      ? 'text-sm text-brand-accent/50 dark:text-gray-400'
      : 'text-xs text-brand-accent/50 dark:text-gray-400';

  return (
    <div className={`space-y-0.5 ${className}`}>
      <p className={primaryClass}>{formatNgnCompact(ngn)}</p>
      {compare != null && !isNaN(compare) && compare > ngn && (
        <p className={`${secondaryClass} line-through`}>{formatPrice(compare)}</p>
      )}
      <p className={secondaryClass}>{formatForeignPrice(usd, 'USD')}</p>
      <p className={secondaryClass}>{formatForeignPrice(gbp, 'GBP')}</p>
      <p className={secondaryClass}>{formatForeignPrice(cad, 'CAD')}</p>
    </div>
  );
}
