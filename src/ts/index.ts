import '../styles/globals.scss';
import { createHeader } from '../components/header/header';
import { createHero } from '../components/hero/hero';
import { createGamesCarousel } from '../components/games-carousel/games-carousel';
import { createLeaderboard } from '../components/leaderboard/leaderboard';
import { createDeveloperCta } from '../components/developer-cta/developer-cta';
import { createFooter } from '../components/footer/footer';
import { createAuthDialog } from '../components/auth-dialog/auth-dialog';
import { createLibrary } from '../components/library/library';
import { getCurrentRoute, type Route } from './router';

const app = document.getElementById('app');

if (app) {
  const main = document.createElement('main');
  main.className = 'main';

  const pages: Partial<Record<Route, HTMLElement[]>> = {};
  const buildPage = (route: Route): HTMLElement[] =>
    route === 'library'
      ? [createLibrary()]
      : [createHero(), createGamesCarousel(), createLeaderboard(), createDeveloperCta()];

  const renderRoute = (): void => {
    const route = getCurrentRoute();
    pages[route] ??= buildPage(route);
    main.replaceChildren(...pages[route]);
    window.scrollTo(0, 0);
  };

  app.append(createHeader(), main, createFooter());
  document.body.append(createAuthDialog());

  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
