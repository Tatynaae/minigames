import './footer.scss';

const GITHUB_PROFILE_URL = 'https://github.com/Tatynaae';
const RS_SCHOOL_COURSE_URL = 'https://rs.school/courses/short-track';

const EXPLORE_LINKS = ['Home', 'Library', 'Categories', 'Tournaments'];
const COMPANY_LINKS = ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'];
const SOCIAL_ICONS = ['share', 'chat', 'rss_feed'];

function renderLogo(): string {
  return `
    <span class="footer__logo" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" stroke-width="2" />
        <path d="M9 20V12L16 17L23 12V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  `;
}

function renderNavGroup(title: string, links: string[]): string {
  return `
    <div class="footer__nav-group">
      <h3 class="footer__nav-title">${title}</h3>
      <ul class="footer__nav-list">
        ${links
          .map(
            (label) => `
              <li><a href="/" class="footer__nav-link">${label}</a></li>
            `,
          )
          .join('')}
      </ul>
    </div>
  `;
}

function renderSocialLinks(): string {
  return SOCIAL_ICONS.map(
    (icon) => `
      <li>
        <a href="/" class="footer__social-link" aria-label="${icon.replace('_', ' ')}">
          <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
        </a>
      </li>
    `,
  ).join('');
}

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer__top">
      <div class="footer__about">
        <div class="footer__logo-row">
          ${renderLogo()}
          <span class="footer__wordmark">MiniGames</span>
        </div>
        <p class="footer__description">
          Take a short break and have fun. Hundreds of curated casual mini-games right in your web browser. No download required.
        </p>
      </div>

      <div class="footer__nav-groups">
        ${renderNavGroup('Explore', EXPLORE_LINKS)}
        ${renderNavGroup('Company', COMPANY_LINKS)}
        <div class="footer__nav-group footer__nav-group--community">
          <h3 class="footer__nav-title">Community</h3>
          <ul class="footer__social-list">
            ${renderSocialLinks()}
          </ul>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <hr class="footer__divider" />
      <div class="footer__meta">
        <p>&copy; 2026 MiniGames. All rights reserved.</p>
        <a href="${RS_SCHOOL_COURSE_URL}" class="footer__rs-link" target="_blank" rel="noopener noreferrer">
            <span class="footer__rs-badge" aria-hidden="true">RS</span>
            <span>RS School</span>
        </a>
        <a href="${GITHUB_PROFILE_URL}" class="footer__github-link" target="_blank" rel="noopener noreferrer">
            <span class="footer__github-badge" aria-hidden="true">
              <span class="material-symbols-outlined" aria-hidden="true">code</span>
            </span>
            <span>@Tatynaae</span>
        </a>
        <p class="footer__designed">Designed with love</p>
      </div>
    </div>
  `;

  return footer;
}
