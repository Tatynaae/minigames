import './library.scss';
import { GAMES, formatLikes, type Game } from '../../data/games';

type CategoryFilter = 'all' | 'puzzle' | 'arcade' | 'farm' | 'card' | 'strategy';
type SortOption = 'rating-desc' | 'rating-asc' | 'name-asc' | 'name-desc';

const PAGE_SIZE = 6;

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All Games' },
  { value: 'puzzle', label: 'Puzzle' },
  { value: 'card', label: 'Card' },
  { value: 'farm', label: 'Farm' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'arcade', label: 'Arcade' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating-asc', label: 'Rating ↑' },
  { value: 'rating-desc', label: 'Rating ↓' },
  { value: 'name-asc', label: 'Name A→Z' },
  { value: 'name-desc', label: 'Name Z→A' },
];

const SORTERS: Record<SortOption, (a: Game, b: Game) => number> = {
  'rating-asc': (a, b) => a.rating - b.rating,
  'rating-desc': (a, b) => b.rating - a.rating,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
};

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(({ value, label }) => [value, label]),
);

function sortLabel(sort: SortOption): string {
  return SORT_OPTIONS.find(({ value }) => value === sort)?.label ?? '';
}

function renderChips(): string {
  return CATEGORIES.map(
    ({ value, label }) => `
      <li>
        <button type="button" class="chip" data-category="${value}" aria-pressed="false">${label}</button>
      </li>
    `,
  ).join('');
}

function renderSortOptions(): string {
  return SORT_OPTIONS.map(
    ({ value, label }) => `
      <li class="sort-menu__item" role="option" data-sort="${value}" aria-selected="false" tabindex="-1">
        <span class="material-symbols-outlined sort-menu__check" aria-hidden="true">check</span>
        ${label}
      </li>
    `,
  ).join('');
}

function renderCard(game: Game): string {
  const isFree = game.price.toLowerCase() === 'free';

  return `
    <li class="library-card">
      <img class="library-card__image" src="${game.image}" alt="${game.name}" loading="lazy" />
      <div class="library-card__content">
        <div class="library-card__header">
          <div class="library-card__info">
            <h3 class="library-card__title">${game.name}</h3>
            <span class="badge">${CATEGORY_LABELS[game.category] ?? game.category}</span>
          </div>
          <span class="library-card__price${isFree ? ' library-card__price--free' : ''}">${game.price}</span>
        </div>
        <p class="library-card__desc">${game.shortDescription}</p>
        <div class="library-card__footer">
          <div class="library-card__stats">
            <span class="library-card__stat" aria-label="Rating ${game.rating.toFixed(1)}">
              <span class="material-symbols-outlined is-filled library-card__icon--star" aria-hidden="true">star</span>
              ${game.rating.toFixed(1)}
            </span>
            <span class="library-card__stat" aria-label="${formatLikes(game.likesCount)} likes">
              <span class="material-symbols-outlined is-filled library-card__icon--favorite" aria-hidden="true">favorite</span>
              ${formatLikes(game.likesCount)}
            </span>
          </div>
          <button type="button" class="btn btn--details">Details</button>
        </div>
      </div>
    </li>
  `;
}

function renderPagination(page: number, totalPages: number): string {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .map(
      (number) => `
        <li>
          <button
            type="button"
            class="page-btn${number === page ? ' is-current' : ''}"
            data-page="${number}"
            aria-label="Page ${number}"
            ${number === page ? 'aria-current="page"' : ''}
          >${number}</button>
        </li>
      `,
    )
    .join('');

  return `
    <button type="button" class="page-btn" data-page="${page - 1}" aria-label="Previous page" ${page <= 1 ? 'disabled' : ''}>
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button>
    <ul class="pagination__pages">${pages}</ul>
    <button type="button" class="page-btn" data-page="${page + 1}" aria-label="Next page" ${page >= totalPages ? 'disabled' : ''}>
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button>
  `;
}

export function createLibrary(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'library';
  section.setAttribute('aria-labelledby', 'library-title');
  section.innerHTML = `
    <div class="library__intro">
      <h1 class="library__title" id="library-title">Game Library</h1>
      <p class="library__subtitle">Browse our collection of casual mini-games</p>
    </div>

    <div class="library__toolbar">
      <ul class="library__chips" aria-label="Filter by category">
        ${renderChips()}
      </ul>

      <div class="sort">
        <button
          type="button"
          class="sort__trigger"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="library-sort-menu"
        >
          <span data-sort-label></span>
          <span class="material-symbols-outlined sort__arrow" aria-hidden="true">arrow_drop_down</span>
        </button>
        <ul class="sort-menu" id="library-sort-menu" role="listbox" aria-label="Sort games" hidden>
          ${renderSortOptions()}
        </ul>
      </div>
    </div>

    <p class="visually-hidden" aria-live="polite" data-count></p>
    <ul class="library__grid" data-grid></ul>
    <nav class="pagination" aria-label="Library pages" data-pagination></nav>
  `;

  initLibraryBehavior(section);

  return section;
}

function initLibraryBehavior(section: HTMLElement): void {
  const grid = section.querySelector<HTMLUListElement>('[data-grid]');
  const pagination = section.querySelector<HTMLElement>('[data-pagination]');
  const count = section.querySelector<HTMLElement>('[data-count]');
  const sortTrigger = section.querySelector<HTMLButtonElement>('.sort__trigger');
  const sortMenu = section.querySelector<HTMLUListElement>('.sort-menu');
  const sortLabelEl = section.querySelector<HTMLElement>('[data-sort-label]');

  if (!grid || !pagination || !count || !sortTrigger || !sortMenu || !sortLabelEl) {
    return;
  }

  const chips = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-category]'));
  const sortItems = Array.from(sortMenu.querySelectorAll<HTMLLIElement>('[data-sort]'));

  let category: CategoryFilter = 'all';
  let sort: SortOption = 'rating-desc';
  let page = 1;

  const render = (): void => {
    const games = GAMES.filter((game) => category === 'all' || game.category === category).sort(
      SORTERS[sort],
    );
    const totalPages = Math.max(1, Math.ceil(games.length / PAGE_SIZE));
    page = Math.min(page, totalPages);
    const pageGames = games.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    chips.forEach((chip) => {
      const isActive = chip.dataset.category === category;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', String(isActive));
    });

    sortLabelEl.textContent = `Sort by: ${sortLabel(sort)}`;
    sortItems.forEach((item) => {
      const isSelected = item.dataset.sort === sort;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
    });

    count.textContent = `${games.length} ${games.length === 1 ? 'game' : 'games'}`;
    grid.innerHTML = pageGames.length
      ? pageGames.map(renderCard).join('')
      : '<li class="library__empty">No games in this category yet.</li>';

    pagination.hidden = totalPages <= 1;
    pagination.innerHTML = renderPagination(page, totalPages);
  };

  const openSortMenu = (): void => {
    sortMenu.hidden = false;
    sortTrigger.setAttribute('aria-expanded', 'true');
    sortTrigger.classList.add('is-open');
    sortMenu.querySelector<HTMLElement>('.is-selected')?.focus();
  };

  const closeSortMenu = (returnFocus = false): void => {
    sortMenu.hidden = true;
    sortTrigger.setAttribute('aria-expanded', 'false');
    sortTrigger.classList.remove('is-open');
    if (returnFocus) sortTrigger.focus();
  };

  const selectSort = (value: SortOption): void => {
    sort = value;
    page = 1;
    closeSortMenu(true);
    render();
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      category = chip.dataset.category as CategoryFilter;
      page = 1;
      render();
    });
  });

  sortTrigger.addEventListener('click', () => {
    if (sortMenu.hidden) {
      openSortMenu();
    } else {
      closeSortMenu();
    }
  });

  sortItems.forEach((item, index) => {
    item.addEventListener('click', () => selectSort(item.dataset.sort as SortOption));
    item.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectSort(item.dataset.sort as SortOption);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        sortItems[(index + step + sortItems.length) % sortItems.length].focus();
      } else if (event.key === 'Escape') {
        closeSortMenu(true);
      }
    });
  });

  document.addEventListener('click', (event: MouseEvent) => {
    if (!sortMenu.hidden && !section.querySelector('.sort')?.contains(event.target as Node)) {
      closeSortMenu();
    }
  });

  pagination.addEventListener('click', (event: MouseEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-page]');
    if (!button || button.disabled) return;

    page = Number(button.dataset.page);
    render();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
}
