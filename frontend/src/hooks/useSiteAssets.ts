import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { siteApi } from '@/api';

export type SiteAssetType =
  | 'favicon'
  | 'logo'
  | 'logo_light'
  | 'logo_dark'
  | 'hero_banner'
  | 'about_image';

export type SiteAssetsMap = Partial<
  Record<SiteAssetType, { asset_type: string; image: string | null; alt_text?: string }>
>;

const FALLBACK_LOGO = `${import.meta.env.BASE_URL}logo.png`;
const FALLBACK_FAVICON = `${import.meta.env.BASE_URL}favicon.png`;

export function getAssetUrl(
  assets: SiteAssetsMap | undefined,
  type: SiteAssetType,
  fallback?: string,
): string {
  const url = assets?.[type]?.image;
  if (url) return url;
  return fallback ?? (type === 'favicon' ? FALLBACK_FAVICON : FALLBACK_LOGO);
}

/** Prefer theme-aware logo; fall back through logo → light/dark → static file. */
export function getBrandLogoUrl(
  assets: SiteAssetsMap | undefined,
  opts?: { prefer?: 'light' | 'dark' | 'default'; onDarkBackground?: boolean },
): string {
  const prefer = opts?.prefer ?? (opts?.onDarkBackground ? 'light' : 'default');
  if (prefer === 'light') {
    return (
      assets?.logo_light?.image ||
      assets?.logo?.image ||
      assets?.logo_dark?.image ||
      FALLBACK_LOGO
    );
  }
  if (prefer === 'dark') {
    return (
      assets?.logo_dark?.image ||
      assets?.logo?.image ||
      assets?.logo_light?.image ||
      FALLBACK_LOGO
    );
  }
  return assets?.logo?.image || assets?.logo_dark?.image || assets?.logo_light?.image || FALLBACK_LOGO;
}

function faviconMime(href: string): string {
  const lower = href.toLowerCase();
  if (lower.includes('.svg')) return 'image/svg+xml';
  if (lower.includes('.ico')) return 'image/x-icon';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.jpg') || lower.includes('.jpeg')) return 'image/jpeg';
  return 'image/png';
}

function applyFavicon(href: string) {
  const head = document.head;
  let link = head.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    head.appendChild(link);
  }
  link.type = faviconMime(href);
  link.href = href;

  let apple = head.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
  if (!apple) {
    apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    head.appendChild(apple);
  }
  apple.href = href;

  head.querySelectorAll<HTMLLinkElement>("link[rel='shortcut icon']").forEach((el) => {
    el.href = href;
  });
}

export function useSiteAssets() {
  const query = useQuery({
    queryKey: ['site-assets'],
    queryFn: () => siteApi.assets().then((r) => r.data as SiteAssetsMap),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.data) return;
    const favicon = getAssetUrl(query.data, 'favicon', FALLBACK_FAVICON);
    applyFavicon(favicon);
  }, [query.data]);

  return {
    assets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    logo: getBrandLogoUrl(query.data),
    logoLight: getBrandLogoUrl(query.data, { prefer: 'light' }),
    logoDark: getBrandLogoUrl(query.data, { prefer: 'dark' }),
    favicon: getAssetUrl(query.data, 'favicon', FALLBACK_FAVICON),
  };
}
