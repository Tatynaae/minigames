import './games-carousel.scss';
import { fetchFeaturedGames, type ApiFeaturedGame } from '../../services/api';
import { formatLikes, getGameCardImage } from '../../data/games';
import { GAME_DETAIL_OPEN_EVENT } from '../game-detail/game-detail';
import { showSnackbar } from '../snackbar/snackbar';

type CardSize = 'hidden' | 'collapsed' | 'regular' | 'featured';

interface GameCardData {
  slug: string;
  image: string;
  name: string;
  rating: string;
  likes: string;
}

function mapApiGame(game: ApiFeaturedGame): GameCardData {
  return {
    slug: game.slug,
    image: getGameCardImage(game.slug) || game.cardImage,
    name: game.name,
    rating: game.rating.toFixed(1),
    likes: formatLikes(game.likesCount),
  };
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
    <li class="game-card" data-card data-slug="${game.slug}">
      <button type="button" class="game-card__trigger" data-card-trigger aria-label="View ${game.name} details">
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

function renderSkeleton(): string {
  const cards = Array.from(
    { length: 5 },
    () => `
    <li class="game-card game-card--skeleton">
      <div class="skeleton-pulse skeleton-pulse--card"></div>
    </li>
  `,
  ).join('');
  return `<ul class="carousel-track">${cards}</ul>`;
}

function renderError(): string {
  return `
    <div class="carousel-state carousel-state--error" role="alert">
      <span class="material-symbols-outlined carousel-state__icon" aria-hidden="true">error</span>
      <p class="carousel-state__text">Failed to load featured games.</p>
      <button type="button" class="btn btn--retry" data-carousel-retry>Try Again</button>
    </div>
  `;
}

function renderEmpty(): string {
  return `
    <div class="carousel-state carousel-state--empty">
      <span class="material-symbols-outlined carousel-state__icon" aria-hidden="true">sports_esports</span>
      <p class="carousel-state__text">No featured games available right now.</p>
    </div>
  `;
}

export function createGamesCarousel(): HTMLElement {
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
    <div class="carousel-content" data-carousel-content>
      ${renderSkeleton()}
    </div>
  `;

  loadCarouselData(section);

  return section;
}

async function loadCarouselData(section: HTMLElement): Promise<void> {
  const content = section.querySelector<HTMLElement>('[data-carousel-content]');
  if (!content) return;

  content.innerHTML = renderSkeleton();

  try {
    const games = await fetchFeaturedGames();

    if (games.length === 0) {
      content.innerHTML = renderEmpty();
      return;
    }

    const cardData = games.map(mapApiGame);

    content.innerHTML = `
      <ul class="carousel-track">
        ${cardData.map(renderGameCard).join('')}
      </ul>
    `;

    initCarouselBehavior(section);
  } catch {
    content.innerHTML = renderError();
    showSnackbar('Failed to load featured games', 'error');

    content.querySelector('[data-carousel-retry]')?.addEventListener('click', () => {
      loadCarouselData(section);
    });
  }
}

const AUTOPLAY_INTERVAL = 4000;
const SWIPE_THRESHOLD = 50;
const OVERLAY_MIN_WIDTH = 288;

function initCarouselBehavior(section: HTMLElement): void {
  const cards = Array.from(section.querySelectorAll<HTMLLIElement>('[data-card]'));
  const track = section.querySelector<HTMLUListElement>('.carousel-track');
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

  let autoplayTimer: ReturnType<typeof setTimeout> | null = null;
  let autoplayStartTime = 0;
  let autoplayRemaining = AUTOPLAY_INTERVAL;

  function clearAutoplayTimer(): void {
    if (autoplayTimer !== null) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function autoplayTick(): void {
    featuredIndex = (featuredIndex + 1) % total;
    applySizes();
    startAutoplay();
  }

  function startAutoplay(): void {
    clearAutoplayTimer();
    autoplayRemaining = AUTOPLAY_INTERVAL;
    autoplayStartTime = Date.now();
    autoplayTimer = setTimeout(autoplayTick, AUTOPLAY_INTERVAL);
  }

  function pauseAutoplay(): void {
    if (autoplayTimer === null) return;
    clearAutoplayTimer();
    autoplayRemaining -= Date.now() - autoplayStartTime;
    if (autoplayRemaining < 0) autoplayRemaining = 0;
  }

  function resumeAutoplay(): void {
    if (autoplayTimer !== null) return;
    autoplayStartTime = Date.now();
    autoplayTimer = setTimeout(autoplayTick, autoplayRemaining);
  }

  function resetAutoplay(): void {
    startAutoplay();
  }

  prevButton?.addEventListener('click', () => {
    featuredIndex = (featuredIndex - 1 + total) % total;
    applySizes();
    resetAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    featuredIndex = (featuredIndex + 1) % total;
    applySizes();
    resetAutoplay();
  });

  let swipeOccurred = false;

  cards.forEach((card) => {
    const trigger = card.querySelector<HTMLButtonElement>('[data-card-trigger]');
    trigger?.addEventListener('click', () => {
      if (swipeOccurred) {
        swipeOccurred = false;
        return;
      }
      const slug = card.dataset.slug;
      if (slug) {
        document.dispatchEvent(new CustomEvent(GAME_DETAIL_OPEN_EVENT, { detail: slug }));
      }
    });
  });

  if (track) {
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isSwiping = false;
    let directionLocked = false;

    track.addEventListener('pointerdown', (event: PointerEvent) => {
      if (!event.isPrimary) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      isSwiping = false;
      directionLocked = false;
      swipeOccurred = false;
      track.setPointerCapture(event.pointerId);
      pauseAutoplay();
    });

    track.addEventListener('pointermove', (event: PointerEvent) => {
      if (!event.isPrimary) return;
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;

      if (!directionLocked) {
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          directionLocked = true;
          isSwiping = Math.abs(dx) > Math.abs(dy);
        }
      }

      if (isSwiping) {
        event.preventDefault();
      }
    });

    track.addEventListener('pointerup', (event: PointerEvent) => {
      if (!event.isPrimary) return;
      const dx = event.clientX - pointerStartX;

      if (isSwiping && Math.abs(dx) >= SWIPE_THRESHOLD) {
        if (dx < 0) {
          featuredIndex = (featuredIndex + 1) % total;
        } else {
          featuredIndex = (featuredIndex - 1 + total) % total;
        }
        applySizes();
        resetAutoplay();
        swipeOccurred = true;
      } else {
        resumeAutoplay();
      }
    });

    track.addEventListener('pointercancel', (event: PointerEvent) => {
      if (!event.isPrimary) return;
      resumeAutoplay();
    });
  }

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const card = entry.target as HTMLElement;
      const width = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      card.classList.toggle('game-card--overlay-hidden', width < OVERLAY_MIN_WIDTH);
    }
  });

  cards.forEach((card) => resizeObserver.observe(card));

  applySizes();
  startAutoplay();
}
