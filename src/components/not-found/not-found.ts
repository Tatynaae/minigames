import './not-found.scss';
import { navigateTo } from '../../ts/router';

export function createNotFound(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'not-found';
  section.setAttribute('aria-label', 'Page not found');

  section.innerHTML = `
    <span class="not-found__code">404</span>
    <h1 class="not-found__title">Page Not Found</h1>
    <p class="not-found__desc">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <button type="button" class="not-found__btn">
      <span class="material-symbols-outlined" aria-hidden="true">home</span>
      Return to Home Page
    </button>
  `;

  section.querySelector('.not-found__btn')?.addEventListener('click', () => {
    navigateTo('/');
  });

  return section;
}
