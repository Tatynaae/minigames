export type Route = 'home' | 'library' | '404';

const PATH_ROUTES: Record<string, Route> = {
  '/': 'home',
  '/home': 'home',
  '/library': 'library',
};

// --- Route resolution ---

export function getCurrentRoute(): Route {
  return PATH_ROUTES[window.location.pathname] ?? '404';
}

// --- Navigation ---

export function navigateTo(path: string, replace = false): void {
  if (replace) {
    window.history.replaceState(null, '', path);
  } else {
    window.history.pushState(null, '', path);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function routeHref(slug: string): string {
  if (slug === '' || slug === 'home') return '/';
  return `/${slug}`;
}

// --- Query parameters ---

export function getQueryParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

export function setQueryParams(params: Record<string, string | null>, replace = false): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }
  if (replace) {
    window.history.replaceState(null, '', url.toString());
  } else {
    window.history.pushState(null, '', url.toString());
  }
}

export function clearQueryParam(key: string): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(key)) return;
  url.searchParams.delete(key);
  window.history.pushState(null, '', url.toString());
}
