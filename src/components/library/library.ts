import './library.scss';
import {
  fetchCategories,
  fetchGames,
  type ApiCategory,
  type ApiGame,
  type GamesPageMeta,
} from '../../services/api';
import { formatLikes, getGameCardImage } from '../../data/games';
import { GAME_DETAIL_OPEN_EVENT } from '../game-detail/game-detail';
import { showSnackbar } from '../snackbar/snackbar';

const PAGE_SIZE = 6;
const DEFAULT_SORT = 'rating-desc';

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'rating-asc', label: 'Rating ↑' },
  { value: 'rating-desc', label: 'Rating ↓' },
  { value: 'name-asc', label: 'Name A→Z' },
  { value: 'name-desc', label: 'Name Z→A' },
];

function sortLabel(sort: string): string {
  return SORT_OPTIONS.find(({ value }) => value === sort)?.label ?? '';
}

function renderChipsSkeleton(): string {
  return Array.from(
    { length: 6 },
    () => '<li><span class="chip chip--skeleton skeleton-pulse"></span></li>',
  ).join('');
}

function renderChips(categories: ApiCategory[]): string {
  return categories
    .map(
      ({ slug, label }) => `
      <li>
        <button type="button" class="chip" data-category="${slug}" aria-pressed="false">${label}</button>
      </li>
    `,
    )
    .join('');
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

function renderCard(game: ApiGame): string {
  const isFree = game.price.toLowerCase() === 'free';
  const image = getGameCardImage(game.slug) || game.cardImage;
  const categoryLabel = game.category.charAt(0).toUpperCase() + game.category.slice(1);

  return `
    <li class="library-card" data-slug="${game.slug}">
      <img class="library-card__image" src="${image}" alt="${game.name}" loading="lazy" />
      <div class="library-card__content">
        <div class="library-card__header">
          <div class="library-card__info">
            <h3 class="library-card__title">${game.name}</h3>
            <span class="badge">${categoryLabel}</span>
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

function renderCardsSkeleton(): string {
  return Array.from(
    { length: PAGE_SIZE },
    () => `
    <li class="library-card library-card--skeleton">
      <div class="library-card__image skeleton-pulse"></div>
      <div class="library-card__content">
        <div class="skeleton-bar" style="width: 60%; height: 20px"></div>
        <div class="skeleton-bar" style="width: 100%; height: 14px"></div>
        <div class="skeleton-bar" style="width: 80%; height: 14px"></div>
      </div>
    </li>
  `,
  ).join('');
}

function renderGridError(): string {
  return `
    <li class="library__state library__state--error" role="alert">
      <span class="material-symbols-outlined library__state-icon" aria-hidden="true">error</span>
      <p class="library__state-text">Failed to load games.</p>
      <button type="button" class="btn btn--retry" data-grid-retry>Try Again</button>
    </li>
  `;
}

function renderGridEmpty(): string {
  return `
    <li class="library__state library__state--empty">
      <span class="material-symbols-outlined library__state-icon" aria-hidden="true">search_off</span>
      <p class="library__state-text">No games found for the selected filters.</p>
    </li>
  `;
}

function getMaxVisiblePages(): number {
  return window.innerWidth <= 599 ? 3 : 4;
}

function getPageWindow(current: number, total: number, maxVisible: number): number[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = current - Math.floor(maxVisible / 2);
  start = Math.max(1, start);
  start = Math.min(start, total - maxVisible + 1);

  return Array.from({ length: maxVisible }, (_, i) => start + i);
}

function renderPagination(page: number, totalPages: number): string {
  const maxVisible = getMaxVisiblePages();
  const window = getPageWindow(page, totalPages, maxVisible);

  const pages = window
    .map(
      (num) => `
      <li>
        <button
          type="button"
          class="page-btn${num === page ? ' is-current' : ''}"
          data-page="${num}"
          aria-label="Page ${num}"
          ${num === page ? 'aria-current="page"' : ''}
        >${num}</button>
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

function readUrlState(defaultCategory: string): { category: string; sort: string; page: number } {
  return {
    category: getQueryParam('category') ?? defaultCategory,
    sort: getQueryParam('sort') ?? DEFAULT_SORT,
    page: Math.max(1, parseInt(getQueryParam('page') ?? '1', 10) || 1),
  };
}

function pushLibraryUrl(category: string, sort: string, page: number): void {
  setQueryParams(
    {
      category,
      sort,
      page: page > 1 ? String(page) : null,
    },
    true,
  );
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
      <ul class="library__chips" aria-label="Filter by category" data-chips>
        ${renderChipsSkeleton()}
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
          <span class="material-symbols-outlined sort__arrow" aria-hidden="true"></span>
        </button>
        <ul class="sort-menu" id="library-sort-menu" role="listbox" aria-label="Sort games" hidden>
          ${renderSortOptions()}
        </ul>
      </div>
    </div>

    <p class="visually-hidden" aria-live="polite" data-count></p>
    <ul class="library__grid" data-grid>${renderCardsSkeleton()}</ul>
    <nav class="pagination" aria-label="Library pages" data-pagination></nav>
  `;

  initLibraryBehavior(section);

  return section;
}

function initLibraryBehavior(section: HTMLElement): void {
  const grid = section.querySelector<HTMLUListElement>('[data-grid]');
  const pagination = section.querySelector<HTMLElement>('[data-pagination]');
  const countEl = section.querySelector<HTMLElement>('[data-count]');
  const chipsContainer = section.querySelector<HTMLUListElement>('[data-chips]');
  const sortTrigger = section.querySelector<HTMLButtonElement>('.sort__trigger');
  const sortMenu = section.querySelector<HTMLUListElement>('.sort-menu');
  const sortLabelEl = section.querySelector<HTMLElement>('[data-sort-label]');

  if (
    !grid ||
    !pagination ||
    !countEl ||
    !chipsContainer ||
    !sortTrigger ||
    !sortMenu ||
    !sortLabelEl
  ) {
    return;
  }

  const sortItems = Array.from(sortMenu.querySelectorAll<HTMLLIElement>('[data-sort]'));

  let category = 'all';
  let sort = DEFAULT_SORT;
  let page = 1;
  let totalPages = 1;

  const updateSortUI = (): void => {
    sortLabelEl.textContent = `Sort by: ${sortLabel(sort)}`;
    sortItems.forEach((item) => {
      const isSelected = item.dataset.sort === sort;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
    });
  };

  const updateChipsUI = (): void => {
    const chips = Array.from(chipsContainer.querySelectorAll<HTMLButtonElement>('[data-category]'));
    chips.forEach((chip) => {
      const isActive = chip.dataset.category === category;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', String(isActive));
    });
  };

  const loadGames = async (): Promise<void> => {
    grid.innerHTML = renderCardsSkeleton();
    pagination.innerHTML = '';

    try {
      const result = await fetchGames({
        category,
        sort,
        page,
        limit: PAGE_SIZE,
      });

      const meta: GamesPageMeta = result.meta;
      totalPages = Math.max(1, meta.totalPages);
      page = meta.page;

      countEl.textContent = `${meta.totalItems} ${meta.totalItems === 1 ? 'game' : 'games'}`;

      if (result.data.length === 0) {
        grid.innerHTML = renderGridEmpty();
      } else {
        grid.innerHTML = result.data.map(renderCard).join('');
      }

      pagination.innerHTML = renderPagination(page, totalPages);
    } catch {
      grid.innerHTML = renderGridError();
      pagination.innerHTML = renderPagination(page, totalPages);
      showSnackbar('Failed to load games', 'error');

      grid.querySelector('[data-grid-retry]')?.addEventListener('click', () => {
        loadGames();
      });
    }
  };

  const loadCategories = async (): Promise<void> => {
    try {
      const categories = await fetchCategories();

      chipsContainer.innerHTML = renderChips(categories);

      const defaultCategory = categories.find((c) => c.isDefault);
      if (defaultCategory) {
        category = defaultCategory.slug;
      }

      updateChipsUI();

      const chips = Array.from(
        chipsContainer.querySelectorAll<HTMLButtonElement>('[data-category]'),
      );
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          category = chip.dataset.category ?? 'all';
          page = 1;
          updateChipsUI();
          loadGames();
        });
      });
    } catch {
      chipsContainer.innerHTML = `
        <li class="library__chips-error">
          <span>Failed to load categories.</span>
          <button type="button" class="btn btn--retry btn--retry-sm" data-chips-retry>Retry</button>
        </li>
      `;
      showSnackbar('Failed to load categories', 'error');

      chipsContainer.querySelector('[data-chips-retry]')?.addEventListener('click', () => {
        chipsContainer.innerHTML = renderChipsSkeleton();
        loadCategories();
      });
    }
  };

  // --- User-driven state change (pushes URL then fetches) ---

  const applyState = (newCategory: string, newSort: string, newPage: number): void => {
    category = newCategory;
    sort = newSort;
    page = newPage;
    pushLibraryUrl(category, sort, page);
    updateChipsUI();
    updateSortUI();
    loadGames();
  };

  // --- Load categories from API ---

  const loadCategories = async (): Promise<void> => {
    try {
      const categories = await fetchCategories();

      chipsContainer.innerHTML = renderChips(categories);

      const defaultCat = categories.find((c) => c.isDefault);
      if (defaultCat) {
        apiDefaultCategory = defaultCat.slug;
      }

      // Read URL state now that we know the API default
      const urlState = readUrlState(apiDefaultCategory);
      category = urlState.category;
      sort = urlState.sort;
      page = urlState.page;

      updateChipsUI();
      updateSortUI();

      // Bind chip click handlers
      const chips = Array.from(
        chipsContainer.querySelectorAll<HTMLButtonElement>('[data-category]'),
      );
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          applyState(chip.dataset.category ?? DEFAULT_CATEGORY, sort, 1);
        });
      });

      // Initial load
      loadGames();
    } catch {
      chipsContainer.innerHTML = `
        <li class="library__chips-error">
          <span>Failed to load categories.</span>
          <button type="button" class="btn btn--retry btn--retry-sm" data-chips-retry>Retry</button>
        </li>
      `;
      showSnackbar('Failed to load categories', 'error');

      chipsContainer.querySelector('[data-chips-retry]')?.addEventListener('click', () => {
        chipsContainer.innerHTML = renderChipsSkeleton();
        loadCategories();
      });
    }
  };

  // --- Sort menu interactions ---

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

  const selectSort = (value: string): void => {
    sort = value;
    page = 1;
    closeSortMenu(true);
    updateSortUI();
    loadGames();
  };

  sortTrigger.addEventListener('click', () => {
    if (sortMenu.hidden) {
      openSortMenu();
    } else {
      closeSortMenu();
    }
  });

  sortItems.forEach((item, index) => {
    item.addEventListener('click', () => selectSort(item.dataset.sort ?? DEFAULT_SORT));
    item.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectSort(item.dataset.sort ?? DEFAULT_SORT);
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

  // --- Grid click: game details ---

  grid.addEventListener('click', (event: MouseEvent) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('.btn--details');
    if (!btn) return;

    const card = btn.closest<HTMLElement>('[data-slug]');
    if (!card?.dataset.slug) return;

    document.dispatchEvent(new CustomEvent(GAME_DETAIL_OPEN_EVENT, { detail: card.dataset.slug }));
  });

  // --- Pagination clicks ---

  pagination.addEventListener('click', (event: MouseEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-page]');
    if (!button || button.disabled) return;

    page = Number(button.dataset.page);
    loadGames();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  updateSortUI();
  loadCategories();
  loadGames();
}
