import './game-detail.scss';
import { getGameHeroImage } from '../../data/games';
import {
  fetchGameDetail,
  fetchGameComments,
  type ApiGameDetail,
  type ApiComment,
} from '../../services/api';
import { showSnackbar } from '../snackbar/snackbar';

export const GAME_DETAIL_OPEN_EVENT = 'game-detail:open';

const MEDALS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

function formatScore(score: number): string {
  return score.toLocaleString();
}

function formatLikes(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count);
}

function pluralize(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'} ago`;
}

function relativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return pluralize(hours, 'hour');

  const days = Math.floor(hours / 24);
  if (days < 7) return pluralize(days, 'day');

  const weeks = Math.floor(days / 7);
  if (weeks <= 3) return pluralize(weeks, 'week');

  const months = Math.floor(days / 30);
  if (months < 12) return pluralize(months, 'month');

  const years = Math.floor(days / 365);
  return pluralize(years, 'year');
}

function renderSkeleton(): string {
  return `
    <div class="game-detail__hero game-detail__hero--skeleton">
      <button type="button" class="game-detail__close" aria-label="Close dialog">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="game-detail__body">
      <div class="skeleton-bar skeleton-bar--heading"></div>
      <div class="skeleton-bar skeleton-bar--line-full"></div>
      <div class="skeleton-bar skeleton-bar--line-wide"></div>
      <div class="skeleton-bar skeleton-bar--line-narrow"></div>
      <div class="game-detail__skeleton-widgets">
        <div class="skeleton-bar skeleton-bar--widget"></div>
        <div class="skeleton-bar skeleton-bar--widget"></div>
        <div class="skeleton-bar skeleton-bar--widget"></div>
        <div class="skeleton-bar skeleton-bar--widget"></div>
      </div>
    </div>
  `;
}

function renderError(): string {
  return `
    <div class="game-detail__hero game-detail__hero--skeleton">
      <button type="button" class="game-detail__close" aria-label="Close dialog">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="game-detail__body">
      <div class="game-detail__state game-detail__state--error" role="alert">
        <span class="material-symbols-outlined game-detail__state-icon" aria-hidden="true">error</span>
        <p class="game-detail__state-text">Failed to load game details.</p>
        <button type="button" class="btn btn--retry" data-detail-retry>Try Again</button>
      </div>
    </div>
  `;
}

function renderRecordRow(record: {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
}): string {
  const medal = MEDALS[record.position - 1] ?? `#${record.position}`;
  return `
    <div class="game-detail__record">
      <span class="game-detail__record-left">
        <span class="game-detail__record-medal">${medal}</span>
        <span class="game-detail__record-name">${record.playerName}</span>
      </span>
      <span class="game-detail__record-right">
        <span class="game-detail__record-score">${formatScore(record.score)} pts</span>
        <span class="game-detail__record-time">${relativeTime(record.achievedAt)}</span>
      </span>
    </div>
  `;
}

function renderComment(comment: ApiComment): string {
  const initial = comment.authorName.charAt(0).toUpperCase();
  const colors = ['#BCE3FF', '#FFD02B', '#E9EEF6', '#C8F7DC', '#F3D1F4'];
  const colorIndex = comment.authorName.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return `
    <div class="game-detail__comment">
      <div class="game-detail__comment-header">
        <span class="game-detail__avatar" style="background-color: ${avatarColor}">${initial}</span>
        <span class="game-detail__comment-name">${comment.authorName}</span>
        <span class="game-detail__comment-time">${relativeTime(comment.createdAt)}</span>
      </div>
      <p class="game-detail__comment-text">${comment.text}</p>
      <div class="game-detail__comment-footer">
        <span class="game-detail__like-display">
          <span class="material-symbols-outlined${comment.isLikedByCurrentUser ? ' is-filled' : ''}">favorite</span>
          <span class="game-detail__like-count">${comment.likesCount}</span>
        </span>
      </div>
    </div>
  `;
}

function renderDialogContent(
  game: ApiGameDetail,
  comments: ApiComment[],
  totalComments: number,
): string {
  const heroImage = getGameHeroImage(game.slug);

  return `
    <div class="game-detail__hero" style="background-image: url('${heroImage}')">
      <button type="button" class="game-detail__close" aria-label="Close dialog">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <div class="game-detail__body">
      <div class="game-detail__title-row">
        <h2 class="game-detail__title">${game.name}</h2>
        <div class="game-detail__ratings">
          <span class="game-detail__stat">
            <span class="material-symbols-outlined is-filled game-detail__icon--star">star</span>
            ${game.rating.toFixed(1)}
          </span>
          <span class="game-detail__stat">
            <span class="material-symbols-outlined is-filled game-detail__icon--favorite">favorite</span>
            ${formatLikes(game.likesCount)}
          </span>
        </div>
      </div>

      <p class="game-detail__desc">${game.fullDescription}</p>

      <div class="game-detail__widgets">
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Genre</span>
          <span class="game-detail__widget-value">${game.specs.genre}</span>
        </div>
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Players</span>
          <span class="game-detail__widget-value">${game.specs.players}</span>
        </div>
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Duration</span>
          <span class="game-detail__widget-value">${game.specs.duration}</span>
        </div>
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Price</span>
          <span class="game-detail__widget-value">${game.specs.price}</span>
        </div>
      </div>

      <div class="game-detail__actions">
        <button type="button" class="game-detail__play-btn">Play Now</button>
        <button type="button" class="game-detail__fav-btn">
          <span class="material-symbols-outlined">favorite</span>
          <span class="game-detail__fav-label">Add to Favorites</span>
        </button>
      </div>

      ${
        game.topRecords.length > 0
          ? `
        <div class="game-detail__records">
          <h3 class="game-detail__section-title">
            <span>\u{1F3C6}</span>
            <span>Top Records</span>
          </h3>
          <div class="game-detail__record-list">
            ${game.topRecords.map(renderRecordRow).join('')}
          </div>
        </div>
      `
          : ''
      }

      <div class="game-detail__comments">
        <h3 class="game-detail__section-title">Comments (${totalComments})</h3>

        <div class="game-detail__comment-list">
          ${comments.length > 0 ? comments.map(renderComment).join('') : '<p class="game-detail__no-comments">No comments yet.</p>'}
        </div>
      </div>
    </div>
  `;
}

export function createGameDetail(): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'game-detail';

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  async function openDialog(slug: string): Promise<void> {
    dialog.innerHTML = renderSkeleton();
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;

    dialog.querySelector('.game-detail__close')?.addEventListener('click', () => dialog.close());

    try {
      const [game, commentsResult] = await Promise.all([
        fetchGameDetail(slug),
        fetchGameComments(slug, 3, 'newest'),
      ]);

      dialog.innerHTML = renderDialogContent(
        game,
        commentsResult.data,
        commentsResult.meta.totalComments,
      );
      dialog.querySelector('.game-detail__close')?.addEventListener('click', () => dialog.close());
    } catch {
      dialog.innerHTML = renderError();
      showSnackbar('Failed to load game details', 'error');

      dialog.querySelector('.game-detail__close')?.addEventListener('click', () => dialog.close());
      dialog.querySelector('[data-detail-retry]')?.addEventListener('click', () => {
        openDialog(slug);
      });
    }
  }

  document.addEventListener(GAME_DETAIL_OPEN_EVENT, ((event: CustomEvent<string>) => {
    openDialog(event.detail);
  }) as EventListener);

  return dialog;
}
