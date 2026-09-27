import './footer.scss';
import logoWhite from '../../assets/icons/logo-white.svg';

const GITHUB_PROFILE_URL = 'https://github.com/Tatynaae';
const RS_SCHOOL_COURSE_URL = 'https://rs.school/courses/short-track';

const EXPLORE_LINKS = ['Home', 'Library', 'Categories', 'Tournaments'];
const COMPANY_LINKS = ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'];
const SOCIAL_ICONS = ['share', 'chat', 'rss_feed'];

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
        <a href="/" class="header__brand" aria-label="MiniGames home">
          <img class="header__logo-img" src="${logoWhite}" alt="MiniGames" />
        </a>
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
        <div class="footer__credits">
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
        </div>
        <p class="footer__designed">Designed with love</p>
      </div>
    </div>
  `;

  return footer;
}
