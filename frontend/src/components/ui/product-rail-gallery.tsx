import * as React from 'react';
import { createPortal } from 'react-dom';

export type GarmentKind = 'tee' | 'knit' | 'hoodie' | 'shirt' | 'jacket' | 'coat';

export interface RailGarment {
  id: string;
  name: string;
  description?: string;
  kind?: GarmentKind;
  color?: string;
  trim?: string;
  /** Front photo. Any product photo works: jewellery, bags, watches, shoes. */
  image?: string;
  /** Back photo. Omit to reuse the front photo so the piece does not change size. */
  backImage?: string;
  /** Side photo. Omit to keep the front photo on the rail. */
  sideImage?: string;
  tag?: string;
  details?: string[];
  href?: string;
}

export interface ClothingRailHeroLabels {
  front: string;
  back: string;
  close: string;
  show: string;
}

export interface ClothingRailHeroProps extends React.ComponentProps<'section'> {
  items: RailGarment[];
  eyebrow?: string;
  heading?: string;
  caption?: string;
  action?: React.ReactNode;
  autoplay?: boolean;
  interval?: number;
  hanger?: 'wood' | 'matte' | 'none';
  labels?: ClothingRailHeroLabels;
  onOpenChange?: (index: number | null) => void;
}

const ASPECT = 200 / 310;
const REST = -68;
const GAP = 0.045;
const MAX_H = 440;
const MIN_WIDE_H = 200;
const CAROUSEL_H = 360;
const SIDE_W = 0.4;
const FRONT_W = 0.94;
const DEFAULT_LABELS: ClothingRailHeroLabels = {
  front: 'Front',
  back: 'Back',
  close: 'Close',
  show: 'Show',
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/** Slot width depends only on the rail height, never on the photo's natural size. */
function footprint(h: number, front: boolean) {
  return h * ASPECT * (front ? FRONT_W : SIDE_W);
}

function PiecePhoto({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span className="absolute inset-0 flex items-end justify-center bg-brand-gray-50 p-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-brand-accent/50">
        {alt}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-center"
    />
  );
}

export function ClothingRailHero({
  items,
  eyebrow,
  heading,
  caption,
  action,
  autoplay = false,
  interval = 2800,
  hanger = 'none',
  labels = DEFAULT_LABELS,
  onOpenChange,
  className,
  ...rest
}: ClothingRailHeroProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  const [active, setActive] = React.useState<number | null>(null);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [reduced, setReduced] = React.useState(false);
  const [playing, setPlaying] = React.useState(autoplay);
  const count = items.length;

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  React.useEffect(() => {
    setPlaying(autoplay);
  }, [autoplay]);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = (next: number) => {
      setWidth((old) => (Math.abs(old - next) < 0.5 ? old : next));
    };
    measure(stage.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const box = entries[0];
      if (box) measure(box.contentRect.width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const carousel = React.useMemo(() => {
    if (!width || count === 0) return width > 0 && width < 720;
    const restK = footprint(1, false) + GAP;
    const activeK = footprint(1, true) + GAP;
    const fit = (width - 24) / (count * restK + (activeK - restK));
    return fit < MIN_WIDE_H;
  }, [width, count]);

  const h = carousel ? Math.min(CAROUSEL_H, Math.max(240, width * 0.72)) : Math.min(MAX_H, Math.max(220, ((width - 24) / (count * (footprint(1, false) + GAP) + (footprint(1, true) - footprint(1, false)))) || MAX_H));
  const boxW = Math.round(h * ASPECT);
  const railY = 18;

  const positions = React.useMemo(() => {
    if (!width || count === 0) return [] as number[];
    const feet = items.map((_, i) => footprint(h, i === active) + h * GAP);
    if (carousel) {
      const centre = active ?? 0;
      const xs = feet.map(() => 0);
      xs[centre] = width / 2;
      for (let i = centre + 1; i < feet.length; i += 1) {
        xs[i] = (xs[i - 1] ?? 0) + ((feet[i - 1] ?? 0) + (feet[i] ?? 0)) / 2;
      }
      for (let i = centre - 1; i >= 0; i -= 1) {
        xs[i] = (xs[i + 1] ?? 0) - ((feet[i + 1] ?? 0) + (feet[i] ?? 0)) / 2;
      }
      return xs;
    }
    const total = feet.reduce((sum, f) => sum + f, 0);
    let cursor = (width - total) / 2;
    return feet.map((f) => {
      const x = cursor + f / 2;
      cursor += f;
      return x;
    });
  }, [active, carousel, count, h, items, width]);

  const stop = React.useCallback(() => setPlaying(false), []);

  const choose = React.useCallback((index: number | null) => {
    setActive((old) => (old === index ? old : index));
  }, []);

  React.useEffect(() => {
    if (!playing || reduced || openIndex !== null || count === 0 || !width) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current === null ? 0 : (current + 1) % count));
    }, active === null ? 900 : interval);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, openIndex, count, interval, width, active]);

  const open = (index: number) => {
    stop();
    setActive(index);
    setOpenIndex(index);
    onOpenChange?.(index);
  };

  const close = () => {
    setOpenIndex(null);
    onOpenChange?.(null);
  };

  const current = active === null ? null : items[active];
  const stageHeight = Math.round(railY + h + 28);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    stop();
    const from = active ?? 0;
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? count - 1
          : clamp(from + (event.key === 'ArrowRight' ? 1 : -1), 0, count - 1);
    choose(next);
  };

  return (
    <section
      {...rest}
      data-slot="clothing-rail-hero"
      data-hanger={hanger}
      aria-roledescription="product rail"
      className={`relative isolate w-full overflow-hidden bg-brand-white text-brand-accent dark:bg-dark-surface dark:text-white ${className ?? ''}`}
    >
      {(eyebrow || heading) && (
        <header className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 pb-2 pt-10 text-center sm:pt-14">
          {eyebrow && (
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-accent/55 dark:text-white/55">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h1 className="text-balance font-display text-4xl font-semibold tracking-tight text-brand-accent dark:text-white sm:text-5xl md:text-6xl">
              {heading}
            </h1>
          )}
        </header>
      )}

      <div
        ref={stageRef}
        role="group"
        aria-label={heading ?? 'Product rail'}
        className="relative mt-2 w-full touch-pan-y select-none"
        style={{ height: stageHeight }}
        onKeyDown={onKeyDown}
        onMouseLeave={() => {
          if (!carousel && openIndex === null) choose(null);
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 z-0 sm:inset-x-10"
          style={{ top: railY + 8, height: 8 }}
        >
          <div className="absolute inset-x-0 top-2 h-3 rounded-full bg-black/10 blur-md dark:bg-black/50" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-neutral-200 via-white to-neutral-500 shadow-[0_1px_0_rgba(0,0,0,0.18)] dark:from-neutral-500 dark:via-neutral-300 dark:to-neutral-700" />
        </div>

        {items.map((item, i) => {
          const turned = active === i;
          const x = positions[i] ?? width / 2;
          const frontSrc = item.image;
          const sideSrc = item.sideImage;
          return (
            <button
              key={item.id}
              type="button"
              data-garment={i}
              aria-label={item.name}
              aria-pressed={turned}
              onClick={() => open(i)}
              onMouseEnter={() => {
                if (!carousel) {
                  stop();
                  choose(i);
                }
              }}
              className="absolute left-0 cursor-pointer rounded-xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:focus-visible:outline-white"
              style={{
                top: railY,
                width: boxW,
                height: h,
                zIndex: turned ? 30 : 10 + i,
                transform: `translate3d(${(x - boxW / 2).toFixed(1)}px, 0, 0)`,
                transition: reduced ? 'none' : 'transform 700ms cubic-bezier(.22,.8,.3,1)',
              }}
            >
              <span className="absolute inset-x-[18%] bottom-[2%] h-[7%] rounded-full bg-black/20 blur-md dark:bg-black/60" />
              <span
                className="absolute inset-0 overflow-hidden rounded-lg bg-white/40 dark:bg-white/5"
                style={{
                  transform: `perspective(1100px) rotateY(${turned ? 0 : REST}deg)`,
                  transformOrigin: '50% 8%',
                  transition: reduced ? 'none' : 'transform 650ms cubic-bezier(.22,.8,.3,1)',
                }}
              >
                {sideSrc && !turned ? (
                  <PiecePhoto src={sideSrc} alt="" />
                ) : (
                  <PiecePhoto src={frontSrc} alt="" />
                )}
              </span>
              {item.tag && (
                <span className="pointer-events-none absolute left-1/2 top-[12%] origin-top -translate-x-1/2 -rotate-6">
                  <span className="mx-auto block h-3 w-px bg-black/30" />
                  <span className="block whitespace-nowrap rounded-[3px] border border-black/10 bg-white px-1.5 py-1 text-[9px] font-semibold tracking-wide text-black shadow-sm">
                    {item.tag}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {carousel && count > 1 && (
        <div className="relative z-10 mt-1 flex justify-center gap-1.5" role="group" aria-label={labels.show}>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${labels.show} ${item.name}`}
              aria-current={active === i}
              onClick={() => {
                stop();
                choose(i);
              }}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                active === i ? 'w-6 bg-black dark:bg-white' : 'w-1.5 bg-black/25 hover:bg-black/45 dark:bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-12 pt-4 text-center">
        <div id={`${uid}-caption`} aria-live="polite" className="min-h-[4.5rem] max-w-2xl">
          <p className="text-sm font-medium text-brand-accent dark:text-white sm:text-base">
            {current ? current.name : caption}
          </p>
          {current?.description && (
            <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-relaxed text-brand-accent/60 dark:text-white/60 sm:text-sm">
              {current.description}
            </p>
          )}
        </div>
        {action}
      </div>

      {openIndex !== null && items[openIndex] && (
        <Detail
          item={items[openIndex]}
          index={openIndex}
          total={count}
          labels={labels}
          onClose={close}
        />
      )}
    </section>
  );
}

function Detail({
  item,
  index,
  total,
  labels,
  onClose,
}: {
  item: RailGarment;
  index: number;
  total: number;
  labels: ClothingRailHeroLabels;
  onClose: () => void;
}) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const [side, setSide] = React.useState<'front' | 'back'>('front');
  const titleId = React.useId();
  const photo = side === 'back' ? item.backImage || item.image : item.image;

  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      setSide((current) => (current === 'front' ? 'back' : 'front'));
    }
  };

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-white/92 p-5 text-brand-accent backdrop-blur-md dark:bg-black/90 dark:text-white"
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-brand-accent/70 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-black dark:text-white/70 dark:hover:text-white dark:focus-visible:ring-white"
      >
        {labels.close}
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
      <div className="grid w-full max-w-5xl items-center gap-8 pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="relative mx-auto aspect-[200/310] h-[min(62vh,520px)] w-auto max-w-full">
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-brand-gray-50 dark:bg-white/5">
            <PiecePhoto key={photo || side} src={photo} alt={side === 'front' ? item.name : ''} />
          </div>
        </div>
        <div className="flex flex-col gap-4 text-center md:text-left">
          <p className="font-mono text-[11px] tracking-[0.2em] text-brand-accent/50 dark:text-white/50">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h3 id={titleId} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm leading-relaxed text-brand-accent/65 dark:text-white/65">{item.description}</p>
          )}
          {item.details && item.details.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
              {item.details.map((detail) => (
                <li key={detail} className="rounded-full border border-black/10 px-3 py-1 text-xs text-brand-accent/70 dark:border-white/15 dark:text-white/70">
                  {detail}
                </li>
              ))}
            </ul>
          )}
          <div role="group" aria-label={`${labels.front} / ${labels.back}`} className="mt-1 inline-flex justify-center gap-6 md:justify-start">
            {(['front', 'back'] as const).map((face) => (
              <button
                key={face}
                type="button"
                aria-pressed={side === face}
                onClick={() => setSide(face)}
                className={`relative pb-1.5 text-sm outline-none ${side === face ? 'text-black dark:text-white' : 'text-brand-accent/50 hover:text-black dark:text-white/50 dark:hover:text-white'}`}
              >
                {face === 'front' ? labels.front : labels.back}
                <span className={`absolute inset-x-0 bottom-0 h-px bg-black transition-transform dark:bg-white ${side === face ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>
          {item.href && (
            <a href={item.href} className="btn-primary mt-2 inline-flex w-max self-center rounded-full px-5 py-2.5 text-sm md:self-start">
              View piece
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ClothingRailHero;
