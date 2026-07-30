import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import FeatureCarousel, {
  type FeatureCarouselItem,
} from '@/components/ui/feature-carousel';
import { siteApi } from '@/api';
import type { WhyChooseItem } from '@/types';

const FALLBACK_FEATURES: FeatureCarouselItem[] = [
  {
    id: 'authentic',
    label: 'Authentic Luxury Pieces',
    description: 'Genuine premium accessories sourced from trusted suppliers.',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'curated',
    label: 'Curated Collections',
    description: 'Jewellery, bags, watches, shoes, sunglasses & more.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'her-him',
    label: 'For Her & Him',
    description: 'Fashion accessories designed for women and men.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'quality',
    label: 'Lasting Quality',
    description: 'Built to last with premium materials and craftsmanship.',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'elegance',
    label: 'Effortless Elegance',
    description: 'Statement pieces that elevate every look.',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'delivery',
    label: 'Fast Delivery',
    description: 'Swift nationwide delivery across Nigeria.',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'gifts',
    label: 'Gift-Ready',
    description: 'Perfect luxury gifts for every occasion.',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
];

function toFeatures(items: WhyChooseItem[]): FeatureCarouselItem[] {
  if (!items.length) return FALLBACK_FEATURES;

  return items.map((item, index) => ({
    id: String(item.id),
    label: item.title,
    description: item.description,
    image:
      item.image ||
      FALLBACK_FEATURES[index % FALLBACK_FEATURES.length].image,
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

  const features = toFeatures(items);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[40vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-14 text-center sm:px-6 sm:pb-8 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-2xl"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            The JBLuxe Difference
          </p>
          <h2 className="mb-3 font-display text-3xl font-semibold text-white sm:mb-4 sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-white/65 sm:text-base">{subtitle}</p>
        </motion.div>
      </div>

      <div className="relative pb-14 sm:pb-20 md:pb-24">
        <FeatureCarousel features={features} />
      </div>
    </section>
  );
}
