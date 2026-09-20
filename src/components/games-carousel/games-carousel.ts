import './games-carousel.scss';
import gamesSeed from '../../data/games-seed.json';
import tailsideCard from '../../assets/images/tailside-cozy-cafe-sim-card.jpg';
import islandersCard from '../../assets/images/islanders-new-shores-card.jpg';
import vacationCard from '../../assets/images/vacation-cafe-simulator-card.jpg';
import winterBurrowCard from '../../assets/images/winter-burrow-card.jpg';
import shelvePotionsCard from '../../assets/images/shelve-the-potions-card.jpg';
import heartopiaCard from '../../assets/images/heartopia-card.jpg';
import paliaCard from '../../assets/images/palia-card.jpg';
import catMailCoCard from '../../assets/images/cat-mail-co-card.jpg';
import tinyGladeCard from '../../assets/images/tiny-glade-card.jpg';

type CardSize = 'collapsed' | 'regular' | 'featured';

interface GameSeedEntry {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured: boolean;
}

interface GameCardData {
  slug: string;
  image: string;
  name: string;
  rating: string;
  likes: string;
}

const CARD_IMAGES: Record<string, string> = {
  'tailside-cozy-cafe-sim': tailsideCard,
  'islanders-new-shores': islandersCard,
  'vacation-cafe-simulator': vacationCard,
  'winter-burrow': winterBurrowCard,
  'shelve-the-potions': shelvePotionsCard,
  heartopia: heartopiaCard,
  palia: paliaCard,
  'cat-mail-co': catMailCoCard,
  'tiny-glade': tinyGladeCard,
};

function formatLikes(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count);
}

function getFeaturedGames(): GameCardData[] {
  return (gamesSeed.data as GameSeedEntry[])
    .filter((game) => game.featured && CARD_IMAGES[game.slug])
    .map((game) => ({
      slug: game.slug,
      image: CARD_IMAGES[game.slug],
      name: game.name,
      rating: game.rating.toFixed(1),
      likes: formatLikes(game.likesCount),
    }));
}

const INITIAL_FEATURED_INDEX = 0;

function sizeForDistance(distance: number): CardSize {
  if (distance === 0) return 'featured';
  if (distance === 1) return 'regular';
  return 'collapsed';
}

function renderGameCard(game: GameCardData): string {
  return `
    <li class="game-card" data-card>
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

  const applySizes = (): void => {
    cards.forEach((card, index) => {
      const distance = Math.abs(index - featuredIndex);
      const size = sizeForDistance(distance);
      card.classList.toggle('game-card--collapsed', size === 'collapsed');
      card.classList.toggle('game-card--featured', size === 'featured');
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

  applySizes();
}
