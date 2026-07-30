import React, { type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  avatarUrl,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        'testimonial-card flex w-72 flex-shrink-0 flex-col items-start gap-4 rounded-lg bg-white p-5 shadow-lg',
        'sm:w-80 sm:p-6 md:w-96',
        'dark:border dark:border-white/10 dark:bg-dark-card',
        className,
      )}
    >
      <p className="text-base leading-relaxed text-brand-accent/80 sm:text-lg dark:text-gray-300">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-3 pt-2 sm:gap-4">
        <img
          src={avatarUrl}
          alt={authorName}
          className="h-11 w-11 rounded-full bg-brand-gray-200 object-cover sm:h-12 sm:w-12"
          loading="lazy"
        />
        <div className="min-w-0">
          <h4 className="truncate text-base font-bold text-brand-black sm:text-lg dark:text-gray-50">
            {authorName}
          </h4>
          <p className="truncate text-sm text-brand-accent/60 dark:text-gray-400">{authorTitle}</p>
        </div>
      </div>
    </article>
  );
}

export interface HorizontalScrollerProps {
  children: ReactNode;
  speed?: string;
  direction?: 'left' | 'right';
  className?: string;
}

export function HorizontalScroller({
  children,
  speed = '40s',
  direction = 'left',
  className,
}: HorizontalScrollerProps) {
  const animationClass =
    direction === 'right' ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal';

  return (
    <div className={cn('group relative w-full overflow-hidden mask-fade', className)}>
      <div
        className={cn('flex w-max', animationClass)}
        style={{ ['--scroll-duration' as string]: speed } as CSSProperties}
      >
        <div className="flex items-stretch justify-center gap-4 px-3 sm:gap-6 sm:px-4 md:gap-8">
          {children}
        </div>
        <div
          className="flex items-stretch justify-center gap-4 px-3 sm:gap-6 sm:px-4 md:gap-8"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface TestimonialRowData {
  id: string;
  speed: string;
  direction: 'left' | 'right';
  testimonials: Array<{
    id: string;
    quote: string;
    authorName: string;
    authorTitle: string;
    avatarUrl: string;
  }>;
}

export interface TestimonialsSectionData {
  title: string;
  subtitle: string;
  rows: TestimonialRowData[];
}

export interface TestimonialsSectionProps {
  data: TestimonialsSectionData;
  className?: string;
}

export default function TestimonialsSection({ data, className }: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        'testimonials-section relative mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-10',
        'sm:gap-10 sm:px-6 sm:py-14 md:gap-12 md:p-10',
        className,
      )}
    >
      <div className="z-10 flex max-w-2xl flex-col items-center gap-3 text-center sm:gap-4 md:gap-6">
        <h2
          className="animate-fade-in-up text-3xl font-extrabold leading-tight text-brand-black sm:text-4xl md:text-5xl dark:text-gray-50"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          {data.title}
        </h2>
        <p
          className="animate-fade-in-up text-sm text-brand-accent/70 sm:text-base md:text-lg dark:text-gray-400"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          {data.subtitle}
        </p>
      </div>

      <div className="z-10 flex w-full max-w-6xl flex-col gap-5 sm:gap-6 md:gap-8">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 85% 67% at 50% 100%, rgba(0,0,0,0.06) 0%, transparent 60%)',
        }}
      />
    </section>
  );
}
