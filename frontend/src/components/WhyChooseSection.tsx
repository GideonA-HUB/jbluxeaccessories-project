import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ZoomParallax, type ParallaxItem } from '@/components/ui/zoom-parallax';
import { siteApi } from '@/api';
import type { WhyChooseItem } from '@/types';

/** Stock HD fallbacks when admin has not uploaded an image yet */
const FALLBACK_IMAGES: ParallaxItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Luxury jewellery',
    title: 'Authentic Luxury Pieces',
    description: 'Genuine premium accessories sourced from trusted suppliers',
  },
  {
    src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Designer bags',
    title: 'Curated Collections',
    description: 'Jewellery, bags, watches, shoes, sunglasses & more',
  },
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format&q=80',
    alt: 'Luxury watch',
    title: 'For Her & Him',
    description: 'Fashion accessories designed for women and men',
  },
  {
    src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Premium shoes',
    title: 'Lasting Quality',
    description: 'Built to last with premium materials and craftsmanship',
  },
  {
    src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop&auto=format&q=80',
    alt: 'Sunglasses',
    title: 'Effortless Elegance',
    description: 'Statement pieces that elevate every look',
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Fast delivery',
    title: 'Fast Delivery',
    description: 'Swift nationwide delivery across Nigeria',
  },
  {
    src: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Gift packaging',
    title: 'Gift-Ready',
    description: 'Perfect luxury gifts for every occasion',
  },
];

function toParallaxItems(items: WhyChooseItem[]): ParallaxItem[] {
  if (!items.length) return FALLBACK_IMAGES;

  return items.map((item, index) => ({
    src: item.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length].src,
    alt: item.alt_text || item.title,
    title: item.title,
    description: item.description,
  }));
}

export default function WhyChooseSection() {
  const { data: items = [] } = useQuery({
    queryKey: ['why-choose'],
    queryFn: () => siteApi.whyChoose(),
  });

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  const title = settings?.why_choose_title || 'Why Choose JBLuxe Accessories';
  const subtitle =
    settings?.why_choose_subtitle || 'Authentic luxury accessories, crafted for elegance';

  const parallaxItems = toParallaxItems(items);

  return (
    <section className="relative bg-brand-black text-white overflow-hidden">
      {/* Intro — scroll into parallax */}
      <div className="relative flex min-h-[50vh] items-center justify-center px-4 section-padding">
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,rgba(230,46,114,0.18),transparent_55%)]',
            'blur-[40px]',
          )}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative text-center max-w-2xl mx-auto"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-pink mb-4">
            The JBLuxe Difference
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-4">
            {title}
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">{subtitle}</p>
          <p className="mt-8 text-xs text-white/40 tracking-widest uppercase animate-pulse">
            Scroll to explore
          </p>
        </motion.div>
      </div>

      <ZoomParallax items={parallaxItems} />

      {/* Outro spacer */}
      <div className="h-[30vh] bg-gradient-to-b from-brand-black to-brand-gray-50" />
    </section>
  );
}
