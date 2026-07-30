import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import TestimonialsSection, {
  type TestimonialsSectionData,
} from '@/components/ui/community-testimonial';
import { siteApi } from '@/api';
import type { Testimonial } from '@/types';

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=128&h=128&q=80',
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    content:
      'JBLuxe Accessories has completely elevated my style. The quality of their jewellery and bags is unmatched — I\'ve never received so many compliments!',
    rating: 5,
    image: FALLBACK_AVATARS[0],
  },
  {
    id: 2,
    name: 'Amaka Okafor',
    role: 'Business Owner',
    content:
      'The customer service is exceptional. They helped me find the perfect watch and bag set for my anniversary and I couldn\'t be happier.',
    rating: 5,
    image: FALLBACK_AVATARS[1],
  },
  {
    id: 3,
    name: 'Chioma Eze',
    role: 'Stylist',
    content:
      'I recommend JBLuxe Accessories to all my clients. The pieces are premium quality and last so long. Worth every naira!',
    rating: 5,
    image: FALLBACK_AVATARS[2],
  },
  {
    id: 4,
    name: 'Ngozi Adewale',
    role: 'Influencer',
    content:
      'The variety is amazing. From earrings and necklaces to sunglasses and sneakers, they have everything you need for any occasion.',
    rating: 5,
    image: FALLBACK_AVATARS[3],
  },
  {
    id: 5,
    name: 'Tunde Bakare',
    role: 'Photographer',
    content:
      'I\'ve worked with many accessory brands, but JBLuxe Accessories stands out for their attention to detail and premium quality products.',
    rating: 5,
    image: FALLBACK_AVATARS[4],
  },
  {
    id: 6,
    name: 'Folake Adeyemi',
    role: 'Creative Director',
    content:
      'Their designer bags and perfume selection are outstanding. My clients love how polished everything looks. JBLuxe is my go-to store.',
    rating: 5,
    image: FALLBACK_AVATARS[5],
  },
];

const ROW_CONFIG: Array<{ id: string; speed: string; direction: 'left' | 'right' }> = [
  { id: 'row1', speed: '50s', direction: 'left' },
  { id: 'row2', speed: '40s', direction: 'right' },
  { id: 'row3', speed: '60s', direction: 'left' },
];

function toCard(t: Testimonial, index: number) {
  return {
    id: String(t.id),
    quote: t.content,
    authorName: t.name,
    authorTitle: t.role || 'Customer',
    avatarUrl: t.image || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
  };
}

/** Split testimonials across up to 3 marquee rows; pad short rows for a smooth loop. */
function buildRows(items: Testimonial[]): TestimonialsSectionData['rows'] {
  const source = items.length > 0 ? items : FALLBACK_TESTIMONIALS;
  const rowCount = source.length <= 3 ? 1 : source.length <= 6 ? 2 : 3;
  const buckets: Testimonial[][] = Array.from({ length: rowCount }, () => []);

  source.forEach((item, index) => {
    buckets[index % rowCount].push(item);
  });

  return buckets.map((bucket, rowIndex) => {
    const config = ROW_CONFIG[rowIndex];
    let cards = bucket.map((t, i) => toCard(t, rowIndex * 10 + i));
    // Ensure enough cards so the marquee never looks sparse on mobile
    while (cards.length < 3) {
      cards = [...cards, ...cards.map((c, i) => ({ ...c, id: `${c.id}-dup-${i}` }))];
    }
    return {
      id: config.id,
      speed: config.speed,
      direction: config.direction,
      testimonials: cards,
    };
  });
}

export default function CommunityTestimonialsSection() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => siteApi.testimonials(),
  });

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  const data = useMemo<TestimonialsSectionData>(
    () => ({
      title: settings?.testimonials_title || 'What Our Clients Say',
      subtitle:
        settings?.testimonials_subtitle ||
        'Real stories from real customers who have experienced the JBLuxe Accessories difference',
      rows: buildRows(testimonials),
    }),
    [settings?.testimonials_title, settings?.testimonials_subtitle, testimonials],
  );

  return (
    <section className="w-full overflow-hidden bg-brand-gray-50 dark:bg-dark-surface">
      <TestimonialsSection data={data} />
    </section>
  );
}
