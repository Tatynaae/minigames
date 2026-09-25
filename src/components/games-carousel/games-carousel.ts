import './games-carousel.scss';
import { GAMES, formatLikes } from '../../data/games';

type CardSize = 'hidden' | 'collapsed' | 'regular' | 'featured';

interface GameCardData {
  slug: string;
  image: string;
  name: string;
  rating: string;
  likes: string;
}

function getFeaturedGames(): GameCardData[] {
  return GAMES.filter((game) => game.featured).map((game) => ({
    slug: game.slug,
    image: game.image,
    name: game.name,
    rating: game.rating.toFixed(1),
    likes: formatLikes(game.likesCount),
  }));
}

const INITIAL_FEATURED_INDEX = 0;

function sizeForDistance(distance: number): CardSize {
  if (distance === 0) return 'featured';
  if (distance === 1) return 'regular';
  if (distance === 2) return 'collapsed';
  return 'hidden';
}

function renderGameCard(game: GameCardData): string {
  return `
    <li class="game-card" data-card>
      <button type="button" class="game-card__trigger" data-card-trigger aria-label="Feature ${game.name}">
        <img class="game-card__image" src="${game.image}" alt="${game.name}" loading="lazy" />
        <div class="game-card__overlay">
          <p class="game-card__title">${game.name}</p>
          <div class="game-card__stats">
            <span class="game-card__stat">
              <span class="material-symbols-outlined is-filled game-card__stat-icon--star" aria-hidden="true">star</span>
              ${game.rating}
            </span>
            <span class="game-card__stat">
              <span class="material-symbols-outlined is-filled game-card__stat-icon--favorite" aria-hidden="true">favorite</span>
              ${game.likes}
            </span>
          </div>
        </div>
      </button>
    </li>
  `;
}

export function createGamesCarousel(): HTMLElement {
  const games = getFeaturedGames();

  const section = document.createElement('section');
  section.className = 'games-section';
  section.setAttribute('aria-label', 'New games');
  section.innerHTML = `
    <div class="games-section__header">
      <div class="section-header">
        <span class="section-header__bar" aria-hidden="true"></span>
        <h2 class="section-header__title">New Games</h2>
      </div>
      <div class="carousel-nav">
        <button type="button" class="carousel-nav__btn" data-carousel-prev aria-label="Show previous game">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        </button>
        <button type="button" class="carousel-nav__btn" data-carousel-next aria-label="Show next game">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </div>

    <ul class="carousel-track">
      ${games.map(renderGameCard).join('')}
    </ul>
  `;

  initCarouselBehavior(section);

  return section;
}

function initCarouselBehavior(section: HTMLElement): void {
  const cards = Array.from(section.querySelectorAll<HTMLLIElement>('[data-card]'));
  const prevButton = section.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const nextButton = section.querySelector<HTMLButtonElement>('[data-carousel-next]');

  let featuredIndex = INITIAL_FEATURED_INDEX;
  const total = cards.length;

  const applySizes = (): void => {
    cards.forEach((card, index) => {
      let offset = index - featuredIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const size = sizeForDistance(Math.abs(offset));
      card.classList.toggle('game-card--collapsed', size === 'collapsed');
      card.classList.toggle('game-card--featured', size === 'featured');
      card.classList.toggle('game-card--hidden', size === 'hidden');
      card.style.order = String(offset);
    });
  };

  prevButton?.addEventListener('click', () => {
    featuredIndex = (featuredIndex - 1 + cards.length) % cards.length;
    applySizes();
  });

  nextButton?.addEventListener('click', () => {
    featuredIndex = (featuredIndex + 1) % cards.length;
    applySizes();
  });

  cards.forEach((card, index) => {
    const trigger = card.querySelector<HTMLButtonElement>('[data-card-trigger]');
    trigger?.addEventListener('click', () => {
      featuredIndex = index;
      applySizes();
    });
  });

  applySizes();
}
