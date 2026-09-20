import '../styles/globals.scss';
import { createHeader } from '../components/header/header';
import { createFooter } from '../components/footer/footer';
import { createAuthDialog } from '../components/auth-dialog/auth-dialog';

const app = document.getElementById('app');

if (app) {
  const main = document.createElement('main');
  main.className = 'main';

  app.append(createHeader(), main, createFooter());
  document.body.append(createAuthDialog());
}
