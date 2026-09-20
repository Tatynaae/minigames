import './hero.scss';
import heroBg from '../../assets/images/hero-bg.png';

export function createHero(): HTMLElement {
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.setAttribute('aria-label', 'Welcome');
  hero.style.setProperty('--hero-bg-image', `url(${heroBg})`);
  hero.innerHTML = `
    <div class="hero__card">
      <h1 class="hero__title">Take a Short Break &amp; Have Fun</h1>
      <p class="hero__description">
        Discover hundreds of curated casual mini-games. Play instantly in your browser —
        puzzle, match 3, farm, and board classics.
      </p>
      <a href="/" class="btn btn--hero">Browse Library</a>
    </div>
  `;

  return hero;
}
