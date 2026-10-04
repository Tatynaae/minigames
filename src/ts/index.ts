import '../styles/globals.scss';
import { createHeader } from '../components/header/header';
import { AUTH_OPEN_EVENT, type AuthMode } from '../components/header/header';
import { createHero } from '../components/hero/hero';
import { createGamesCarousel } from '../components/games-carousel/games-carousel';
import { createLeaderboard } from '../components/leaderboard/leaderboard';
import { createDeveloperCta } from '../components/developer-cta/developer-cta';
import { createFooter } from '../components/footer/footer';
import { createAuthDialog } from '../components/auth-dialog/auth-dialog';
import { createGameDetail, GAME_DETAIL_OPEN_EVENT } from '../components/game-detail/game-detail';
import { createLibrary } from '../components/library/library';
import { createNotFound } from '../components/not-found/not-found';
import {
  getCurrentRoute,
  getQueryParam,
  setQueryParams,
  clearQueryParam,
  type Route,
} from './router';

const app = document.getElementById('app');

if (app) {
  const main = document.createElement('main');
  main.className = 'main';

  const pages: Partial<Record<Route, HTMLElement[]>> = {};
  const buildPage = (route: Route): HTMLElement[] => {
    switch (route) {
      case 'library':
        return [createLibrary()];
      case '404':
        return [createNotFound()];
      default:
        return [createHero(), createGamesCarousel(), createLeaderboard(), createDeveloperCta()];
    }
  };

  let currentRoute: Route | null = null;

  const renderRoute = (): void => {
    const route = getCurrentRoute();
    if (route === currentRoute) return;
    pages[route] ??= buildPage(route);
    main.replaceChildren(...pages[route]);
    currentRoute = route;
    window.scrollTo(0, 0);
  };

  app.append(createHeader(), main, createFooter());

  const gameDialog = createGameDetail();
  const authDialog = createAuthDialog();
  document.body.append(authDialog);
  document.body.append(gameDialog);

  document.addEventListener(GAME_DETAIL_OPEN_EVENT, ((event: CustomEvent<string>) => {
    if (getQueryParam('game') !== event.detail) {
      setQueryParams({ game: event.detail });
    }
  }) as EventListener);

  gameDialog.addEventListener('close', () => {
    if (getQueryParam('game')) {
      clearQueryParam('game');
    }
  });

  document.addEventListener(AUTH_OPEN_EVENT, ((event: CustomEvent<AuthMode>) => {
    if (getQueryParam('auth') !== event.detail) {
      setQueryParams({ auth: event.detail });
    }
  }) as EventListener);

  authDialog.addEventListener('close', () => {
    if (getQueryParam('auth')) {
      clearQueryParam('auth');
    }
  });

  window.addEventListener('popstate', () => {
    renderRoute();

    const gameSlug = getQueryParam('game');
    if (gameSlug && !gameDialog.open) {
      document.dispatchEvent(new CustomEvent(GAME_DETAIL_OPEN_EVENT, { detail: gameSlug }));
    } else if (!gameSlug && gameDialog.open) {
      gameDialog.close();
    }

    const authMode = getQueryParam('auth');
    if ((authMode === 'login' || authMode === 'register') && !authDialog.open) {
      document.dispatchEvent(new CustomEvent<AuthMode>(AUTH_OPEN_EVENT, { detail: authMode }));
    } else if (!authMode && authDialog.open) {
      authDialog.close();
    }
  });

  renderRoute();

  const initialGame = getQueryParam('game');
  if (initialGame) {
    document.dispatchEvent(new CustomEvent(GAME_DETAIL_OPEN_EVENT, { detail: initialGame }));
  }

  const initialAuth = getQueryParam('auth');
  if (initialAuth === 'login' || initialAuth === 'register') {
    document.dispatchEvent(new CustomEvent<AuthMode>(AUTH_OPEN_EVENT, { detail: initialAuth }));
  }
}
