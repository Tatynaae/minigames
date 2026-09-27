import '../styles/globals.scss';
import { createHeader } from '../components/header/header';
import { createHero } from '../components/hero/hero';
import { createGamesCarousel } from '../components/games-carousel/games-carousel';
import { createLeaderboard } from '../components/leaderboard/leaderboard';
import { createDeveloperCta } from '../components/developer-cta/developer-cta';
import { createFooter } from '../components/footer/footer';
import { createAuthDialog } from '../components/auth-dialog/auth-dialog';

const app = document.getElementById('app');

if (app) {
  const main = document.createElement('main');
  main.className = 'main';
  main.append(createHero(), createGamesCarousel(), createLeaderboard(), createDeveloperCta());

  app.append(createHeader(), main, createFooter());
  document.body.append(createAuthDialog());
}
