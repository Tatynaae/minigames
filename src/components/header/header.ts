import './header.scss';
import logo from '../../assets/icons/logo.svg';

export const AUTH_OPEN_EVENT = 'auth:open';

export type AuthMode = 'login' | 'register';

const NAV_LINKS: { label: string; active?: boolean }[] = [
  { label: 'Home', active: true },
  { label: 'Library' },
  { label: 'Tournaments' },
  { label: 'Community' },
];

function renderLogo(): string {
  return `<img class="header__logo-img" src="${logo}" alt="MiniGames" />`;
}

function renderDesktopLinks(): string {
  return NAV_LINKS.map(
    ({ label, active }) => `
      <li>
        <a href="/" class="header__link${active ? ' header__link--active' : ''}">${label}</a>
      </li>
    `,
  ).join('');
}

function renderMobileLinks(): string {
  return NAV_LINKS.map(
    ({ label, active }) => `
      <li>
        <a href="/" class="mobile-menu__link${active ? ' mobile-menu__link--active' : ''}">${label}</a>
      </li>
    `,
  ).join('');
}

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <a href="/" class="header__brand" aria-label="MiniGames home">
      ${renderLogo()}
    </a>

    <nav class="header__nav" aria-label="Primary">
      <ul class="header__links">
        ${renderDesktopLinks()}
      </ul>
      <div class="header__buttons">
        <button type="button" class="btn btn--outline" data-auth-trigger="login">Log In</button>
        <button type="button" class="btn btn--accent" data-auth-trigger="register">Sign Up</button>
      </div>
    </nav>

    <button type="button" class="btn btn--accent header__mobile-cta" data-auth-trigger="register">
      Sign Up
    </button>

    <button
      type="button"
      class="header__burger"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <span class="material-symbols-outlined" aria-hidden="true">menu</span>
    </button>

    <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation" hidden>
      <div class="mobile-menu__top">
        <a href="/" class="header__brand" aria-label="MiniGames home">
          ${renderLogo()}
        </a>
        <button type="button" class="mobile-menu__close" aria-label="Close menu">
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </div>
      <ul class="mobile-menu__links">
        ${renderMobileLinks()}
      </ul>
      <div class="mobile-menu__buttons">
        <button type="button" class="btn btn--outline" data-auth-trigger="login">Log In</button>
        <button type="button" class="btn btn--accent" data-auth-trigger="register">Sign Up</button>
      </div>
    </div>
  `;

  initHeaderBehavior(header);

  return header;
}

function initHeaderBehavior(header: HTMLElement): void {
  const burger = header.querySelector<HTMLButtonElement>('.header__burger');
  const mobileMenu = header.querySelector<HTMLElement>('.mobile-menu');
  const closeButton = header.querySelector<HTMLButtonElement>('.mobile-menu__close');

  if (!burger || !mobileMenu || !closeButton) {
    return;
  }

  const openMobileMenu = (): void => {
    mobileMenu.hidden = false;
    requestAnimationFrame(() => {
      mobileMenu.classList.add('is-open');
    });
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = (): void => {
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const onTransitionEnd = (): void => {
      mobileMenu.hidden = true;
      mobileMenu.removeEventListener('transitionend', onTransitionEnd);
    };
    mobileMenu.addEventListener('transitionend', onTransitionEnd);
  };

  burger.addEventListener('click', openMobileMenu);
  closeButton.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !mobileMenu.hidden) {
      closeMobileMenu();
    }
  });

  header.querySelectorAll<HTMLButtonElement>('[data-auth-trigger]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.authTrigger as AuthMode;
      if (!mobileMenu.hidden) {
        closeMobileMenu();
      }
      document.dispatchEvent(new CustomEvent<AuthMode>(AUTH_OPEN_EVENT, { detail: mode }));
    });
  });
}
