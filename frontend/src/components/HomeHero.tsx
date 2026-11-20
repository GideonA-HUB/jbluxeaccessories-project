import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ClothingRailHero from '@/components/ui/product-rail-gallery';
import type { RailGarment } from '@/components/ui/product-rail-gallery';
import { siteApi } from '@/api';
import type { SiteSettings } from '@/types';

interface HeroImageApi {
  id: number;
  image: string | null;
  back_image?: string | null;
  side_image?: string | null;
  alt_text: string;
  category: string;
  title: string;
  description?: string;
  tag?: string;
  details?: string;
  link_url: string;
}

const FALLBACK_ITEMS: RailGarment[] = [
  {
    id: 'jewellery',
    name: 'Statement Earrings & Necklaces',
    tag: 'Jewellery',
    description: 'Gold-tone pieces chosen for everyday luxury.',
    details: ['Jewellery', 'Gift ready'],
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&h=1200&q=80',
    href: '/shop',
  },
  {
    id: 'bags',
    name: 'Designer & Luxury Bags',
    tag: 'Bags',
    description: 'Structured bags with a clean black and white finish.',
    details: ['Bags', 'Everyday carry'],
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&h=1200&q=80',
    href: '/shop',
  },
  {
    id: 'watches',
    name: 'Timeless Luxury Watches',
    tag: 'Watches',
    description: 'Slim watches that sit cleanly on the rail.',
    details: ['Watches'],
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=1200&q=80',
    href: '/shop',
  },
  {
    id: 'shoes',
    name: 'Heels, Sneakers & Sandals',
    tag: 'Shoes',
    description: 'Footwear edited for the JBLuxe rail.',
    details: ['Shoes'],
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=1200&q=80',
    href: '/shop',
  },
  {
    id: 'sunglasses',
    name: 'Iconic Eyewear',
    tag: 'Sunglasses',
    description: 'Sharp frames in the house black and white palette.',
    details: ['Sunglasses'],
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&h=1200&q=80',
    href: '/shop',
  },
];

function resolvePath(path: string | undefined, fallback: string) {
  const value = (path || fallback).trim();
  if (!value) return fallback;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

function splitDetails(value?: string) {
  if (!value) return undefined;
  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
}

export default function HomeHero() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: heroImages = [] } = useQuery<HeroImageApi[]>({
    queryKey: ['hero-images'],
    queryFn: async () => {
      const response = await fetch('/api/v1/site/hero-images/');
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : data.results ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const title = settings?.hero_title?.trim() || 'Discover Your Perfect Style';
  const subtitle =
    settings?.hero_subtitle?.trim() ||
    'Brush along the rail. Open a piece to see the details.';
  const eyebrow = settings?.hero_eyebrow?.trim() || 'Luxury Fashion Accessories';
  const primaryLabel = settings?.hero_primary_cta_label?.trim() || 'Shop Now';
  const primaryUrl = resolvePath(settings?.hero_primary_cta_url, '/shop');

  const fromAdmin: RailGarment[] = heroImages
    .filter((img) => Boolean(img.image))
    .map((img) => ({
      id: String(img.id),
      name: img.title?.trim() || img.alt_text?.trim() || 'JBLuxe piece',
      description: img.description?.trim() || img.alt_text?.trim() || undefined,
      tag: img.tag?.trim() || img.category?.trim() || undefined,
      details: splitDetails(img.details),
      image: img.image as string,
      backImage: img.back_image || img.image || undefined,
      sideImage: img.side_image || undefined,
      href: resolvePath(img.link_url, '/shop'),
    }));

  const items = fromAdmin.length > 0 ? fromAdmin : FALLBACK_ITEMS;
  const external = primaryUrl.startsWith('http');

  return (
    <ClothingRailHero
      items={items}
      hanger="none"
      autoplay
      eyebrow={eyebrow}
      heading={title}
      caption={subtitle}
      className="bg-brand-white text-brand-accent dark:bg-dark-surface dark:text-white"
      action={
        external ? (
          <a href={primaryUrl} className="btn-primary inline-flex items-center rounded-full px-6 py-2.5 text-sm">
            {primaryLabel}
          </a>
        ) : (
          <Link to={primaryUrl} className="btn-primary inline-flex items-center rounded-full px-6 py-2.5 text-sm">
            {primaryLabel}
          </Link>
        )
      }
    />
  );
}
