import './game-detail.scss';
import { GAMES, formatLikes, getGameHeroImage, getGameDetail, type Game } from '../../data/games';

export const GAME_DETAIL_OPEN_EVENT = 'game-detail:open';

interface RecordEntry {
  medal: string;
  name: string;
  score: number;
  time: string;
}

interface CommentEntry {
  name: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
}

const DEFAULT_RECORDS: RecordEntry[] = [
  { medal: '\u{1F947}', name: 'ForestSpirit', score: 356700, time: '2 days ago' },
  { medal: '\u{1F948}', name: 'TeaBrewer', score: 332400, time: '5 days ago' },
  { medal: '\u{1F949}', name: 'HerbalistPath', score: 308900, time: '1 week ago' },
];

const DEFAULT_COMMENTS: CommentEntry[] = [
  {
    name: 'ForestDweller',
    avatar: '#BCE3FF',
    time: '3 hours ago',
    text: 'This game is absolutely delightful! The art style reminds me of a Studio Ghibli film. Spent the whole evening playing.',
    likes: 12,
    liked: false,
  },
  {
    name: 'HerbalTeaLover',
    avatar: '#FFD02B',
    time: '1 day ago',
    text: 'Perfect for unwinding after a long day. The soundtrack is incredibly soothing too.',
    likes: 5,
    liked: false,
  },
  {
    name: 'CottageCoreMia',
    avatar: '#E9EEF6',
    time: '3 days ago',
    text: 'Just discovered this gem and I am hooked! Love the attention to detail in every scene.',
    likes: 8,
    liked: true,
  },
];

function formatScore(score: number): string {
  return score.toLocaleString();
}

function renderRecordRow(record: RecordEntry): string {
  return `
    <div class="game-detail__record">
      <span class="game-detail__record-left">
        <span class="game-detail__record-medal">${record.medal}</span>
        <span class="game-detail__record-name">${record.name}</span>
      </span>
      <span class="game-detail__record-right">
        <span class="game-detail__record-score">${formatScore(record.score)} pts</span>
        <span class="game-detail__record-time">${record.time}</span>
      </span>
    </div>
  `;
}

function renderComment(comment: CommentEntry, index: number): string {
  const initial = comment.name.charAt(0).toUpperCase();
  return `
    <div class="game-detail__comment" data-comment-index="${index}">
      <div class="game-detail__comment-header">
        <span class="game-detail__avatar" style="background-color: ${comment.avatar}">${initial}</span>
        <span class="game-detail__comment-name">${comment.name}</span>
        <span class="game-detail__comment-time">${comment.time}</span>
      </div>
      <p class="game-detail__comment-text">${comment.text}</p>
      <div class="game-detail__comment-footer">
        <button type="button" class="game-detail__like-btn${comment.liked ? ' is-liked' : ''}" data-like-index="${index}">
          <span class="material-symbols-outlined${comment.liked ? ' is-filled' : ''}">favorite</span>
          <span class="game-detail__like-count">${comment.likes}</span>
        </button>
      </div>
    </div>
  `;
}

function renderDialogContent(game: Game): string {
  const heroImage = getGameHeroImage(game.slug);
  const detail = getGameDetail(game.slug);
  const categoryLabel = game.category.charAt(0).toUpperCase() + game.category.slice(1);

  const records = DEFAULT_RECORDS;
  const comments = DEFAULT_COMMENTS;

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

      <p class="game-detail__desc">${detail.description}</p>

      <div class="game-detail__widgets">
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Genre</span>
          <span class="game-detail__widget-value">${categoryLabel}</span>
        </div>
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Players</span>
          <span class="game-detail__widget-value">${detail.players}</span>
        </div>
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Duration</span>
          <span class="game-detail__widget-value">${detail.duration}</span>
        </div>
        <div class="game-detail__widget">
          <span class="game-detail__widget-label">Price</span>
          <span class="game-detail__widget-value">${game.price}</span>
        </div>
      </div>

      <div class="game-detail__actions">
        <button type="button" class="game-detail__play-btn">Play Now</button>
        <button type="button" class="game-detail__fav-btn">
          <span class="material-symbols-outlined">favorite</span>
          <span class="game-detail__fav-label">Add to Favorites</span>
        </button>
      </div>

      <div class="game-detail__records">
        <h3 class="game-detail__section-title">
          <span>\u{1F3C6}</span>
          <span>Top Records</span>
        </h3>
        <div class="game-detail__record-list">
          ${records.map(renderRecordRow).join('')}
        </div>
      </div>

      <div class="game-detail__comments">
        <h3 class="game-detail__section-title" data-comment-count>Comments (${comments.length})</h3>

        <div class="game-detail__comment-form">
          <span class="game-detail__avatar game-detail__avatar--user">U</span>
          <textarea class="game-detail__textarea" placeholder="Add a comment..." rows="1"></textarea>
          <button type="button" class="game-detail__send-btn" aria-label="Send comment">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>

        <div class="game-detail__comment-list" data-comment-list>
          ${comments.map((c, i) => renderComment(c, i)).join('')}
        </div>
      </div>
    </div>
  `;
}

export function createGameDetail(): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'game-detail';

  let commentLikes: { liked: boolean; count: number }[] = [];

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  function openDialog(game: Game): void {
    commentLikes = DEFAULT_COMMENTS.map((c) => ({
      liked: c.liked,
      count: c.likes,
    }));

    dialog.innerHTML = renderDialogContent(game);
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;

    initDialogBehavior();
  }

  function initDialogBehavior(): void {
    const closeBtn = dialog.querySelector<HTMLButtonElement>('.game-detail__close');
    const favBtn = dialog.querySelector<HTMLButtonElement>('.game-detail__fav-btn');
    const textarea = dialog.querySelector<HTMLTextAreaElement>('.game-detail__textarea');
    const sendBtn = dialog.querySelector<HTMLButtonElement>('.game-detail__send-btn');
    const commentList = dialog.querySelector<HTMLElement>('[data-comment-list]');
    const commentCountEl = dialog.querySelector<HTMLElement>('[data-comment-count]');

    closeBtn?.addEventListener('click', () => dialog.close());

    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const isFavorited = favBtn.classList.toggle('is-favorited');
        const icon = favBtn.querySelector('.material-symbols-outlined');
        const label = favBtn.querySelector('.game-detail__fav-label');
        if (icon) {
          icon.classList.toggle('is-filled', isFavorited);
        }
        if (label) {
          label.textContent = isFavorited ? 'Remove from Favorites' : 'Add to Favorites';
        }
      });
    }

    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      });

      textarea.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          submitComment();
        }
      });
    }

    sendBtn?.addEventListener('click', submitComment);

    function submitComment(): void {
      if (!textarea || !commentList || !commentCountEl) return;

      const text = textarea.value.trim();
      if (!text) return;

      const newIndex = commentList.children.length;
      commentLikes.push({ liked: false, count: 0 });

      const commentHtml = `
        <div class="game-detail__comment" data-comment-index="${newIndex}">
          <div class="game-detail__comment-header">
            <span class="game-detail__avatar" style="background-color: #FFD02B">U</span>
            <span class="game-detail__comment-name">You</span>
            <span class="game-detail__comment-time">Just now</span>
          </div>
          <p class="game-detail__comment-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          <div class="game-detail__comment-footer">
            <button type="button" class="game-detail__like-btn" data-like-index="${newIndex}">
              <span class="material-symbols-outlined">favorite</span>
              <span class="game-detail__like-count">0</span>
            </button>
          </div>
        </div>
      `;

      commentList.insertAdjacentHTML('afterbegin', commentHtml);
      bindLikeButton(commentList.firstElementChild as HTMLElement);

      const totalComments = commentList.children.length;
      commentCountEl.textContent = `Comments (${totalComments})`;

      textarea.value = '';
      textarea.style.height = 'auto';
    }

    dialog.querySelectorAll<HTMLButtonElement>('[data-like-index]').forEach((btn) => {
      bindLikeButton(btn.closest('.game-detail__comment') as HTMLElement);
    });
  }

  function bindLikeButton(commentEl: HTMLElement | null): void {
    if (!commentEl) return;

    const btn = commentEl.querySelector<HTMLButtonElement>('[data-like-index]');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.likeIndex);
      const state = commentLikes[index];
      if (!state) return;

      state.liked = !state.liked;
      state.count += state.liked ? 1 : -1;

      btn.classList.toggle('is-liked', state.liked);
      const icon = btn.querySelector('.material-symbols-outlined');
      const countEl = btn.querySelector('.game-detail__like-count');

      if (icon) icon.classList.toggle('is-filled', state.liked);
      if (countEl) countEl.textContent = String(state.count);
    });
  }

  document.addEventListener(GAME_DETAIL_OPEN_EVENT, ((event: CustomEvent<string>) => {
    const slug = event.detail;
    const game = GAMES.find((g) => g.slug === slug);
    if (game) openDialog(game);
  }) as EventListener);

  return dialog;
}
