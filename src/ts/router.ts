export type Route = 'home' | 'library';

const ROUTES: Record<string, Route> = {
  '': 'home',
  library: 'library',
};

export function getCurrentRoute(): Route {
  const slug = window.location.hash.replace(/^#\/?/, '');
  return ROUTES[slug] ?? 'home';
}

export function routeHref(slug: string): string {
  return `#/${slug}`;
}
