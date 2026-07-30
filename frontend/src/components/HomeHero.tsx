import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PulseFitHero } from '@/components/ui/pulse-fit-hero';
import { siteApi } from '@/api';
import type { SiteSettings } from '@/types';

interface HeroImageApi {
  id: number;
  image: string;
  alt_text: string;
  category: string;
  title: string;
  link_url: string;
  order: number;
  is_active: boolean;
}

const FALLBACK_CARDS = [
  {
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'JEWELLERY',
    title: 'Statement Earrings & Necklaces',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'BAGS',
    title: 'Designer & Luxury Bags',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'WATCHES',
    title: 'Timeless Luxury Watches',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'SHOES',
    title: 'Heels, Sneakers & Sandals',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'SUNGLASSES',
    title: 'Iconic Eyewear',
    link_url: '/shop',
  },
];

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format&q=80',
];

function resolvePath(path: string | undefined, fallback: string) {
  const value = (path || fallback).trim();
  if (!value) return fallback;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

export default function HomeHero() {
  const navigate = useNavigate();

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
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const go = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      window.location.href = path;
      return;
    }
    navigate(path);
  };

  const title =
    settings?.hero_title?.trim() ||
    'Discover Your Perfect Style';
  const subtitle =
    settings?.hero_subtitle?.trim() ||
    settings?.meta_description?.trim() ||
    'Explore our premium collection of jewellery, bags, watches, shoes, sunglasses, and fashion accessories. Curated for women and men who demand excellence.';
  const eyebrow =
    settings?.hero_eyebrow?.trim() ||
    settings?.tagline?.trim() ||
    settings?.site_name ||
    'Luxury Fashion Accessories';

  const primaryLabel = settings?.hero_primary_cta_label?.trim() || 'Shop Now';
  const primaryUrl = resolvePath(settings?.hero_primary_cta_url, '/shop');
  const secondaryLabel = settings?.hero_secondary_cta_label?.trim() || 'Browse Categories';
  const secondaryUrl = resolvePath(settings?.hero_secondary_cta_url, '/categories');

  const cards =
    heroImages.length > 0
      ? heroImages.map((img) => ({
          image: img.image,
          category: img.category?.trim() || 'COLLECTION',
          title: img.title?.trim() || img.alt_text?.trim() || 'Luxury Collection',
          onClick: () => go(resolvePath(img.link_url, '/shop')),
        }))
      : FALLBACK_CARDS.map((card) => ({
          ...card,
          onClick: () => go(card.link_url),
        }));

  return (
    <PulseFitHero
      showHeader={false}
      logo={settings?.site_name || 'JBLuxe Accessories'}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryAction={{
        label: primaryLabel,
        onClick: () => go(primaryUrl),
      }}
      secondaryAction={{
        label: secondaryLabel,
        onClick: () => go(secondaryUrl),
      }}
      disclaimer={
        settings?.hero_disclaimer?.trim() ||
        'Nationwide delivery · Secure checkout · Luxury quality guaranteed'
      }
      socialProof={{
        avatars: FALLBACK_AVATARS,
        text:
          settings?.hero_social_proof_text?.trim() ||
          'Trusted by style lovers across Nigeria',
      }}
      programs={cards}
    />
  );
}
