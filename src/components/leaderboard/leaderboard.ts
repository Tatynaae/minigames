import './leaderboard.scss';
import { fetchLeaderboard, type ApiLeaderboardEntry } from '../../services/api';
import fireIcon from '../../assets/icons/fire-icon.svg';
import { showSnackbar } from '../snackbar/snackbar';

const AVATAR_COLORS = [
  'var(--avatar-yellow)',
  'var(--avatar-mint)',
  'var(--avatar-sky)',
  'var(--avatar-pink)',
  'var(--avatar-lavender)',
];

function getInitials(name: string): string {
  const words = name.match(/[A-Z][a-z0-9]*/g);
  if (words && words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

function renderRow(player: ApiLeaderboardEntry, index: number): string {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return `
    <tr>
      <td><span class="leaderboard__rank">#${player.rank}</span></td>
      <td>
        <div class="leaderboard__player">
          <span class="leaderboard__avatar" style="background: ${avatarColor}">${getInitials(player.playerName)}</span>
          <span class="leaderboard__name">${player.playerName}</span>
        </div>
      </td>
      <td><span class="leaderboard__games">${player.gamesPlayed}</span></td>
      <td><span class="leaderboard__score">${formatScore(player.totalScore)}</span></td>
      <td><span class="leaderboard__streak">
      <img class="leaderboard__streak-icon" src="${fireIcon}" alt="" /> ${player.streakDays} days</span>
      </td>
      <td><span class="leaderboard__game-tag">${player.favoriteGameName}</span></td>
    </tr>
  `;
}

function getMaxVisiblePlayers(): number {
  const width = window.innerWidth;
  if (width <= 768) return 3;
  return 5;
}

function renderSkeletonRows(count: number): string {
  return Array.from(
    { length: count },
    () => `
    <tr class="leaderboard__skeleton-row">
      <td><span class="skeleton-bar skeleton-bar--rank"></span></td>
      <td>
        <div class="leaderboard__player">
          <span class="skeleton-circle"></span>
          <span class="skeleton-bar skeleton-bar--name"></span>
        </div>
      </td>
      <td><span class="skeleton-bar skeleton-bar--num"></span></td>
      <td><span class="skeleton-bar skeleton-bar--num"></span></td>
      <td><span class="skeleton-bar skeleton-bar--streak"></span></td>
      <td><span class="skeleton-bar skeleton-bar--tag"></span></td>
    </tr>
  `,
  ).join('');
}

function renderSkeleton(count: number): string {
  return `
    <div class="leaderboard-wrapper">
      <table class="leaderboard">
        <caption class="visually-hidden">Loading leaderboard data</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Player</th>
            <th scope="col">Games Played</th>
            <th scope="col">Total Score</th>
            <th scope="col">Streak</th>
            <th scope="col">Favorite Game</th>
          </tr>
        </thead>
        <tbody>
          ${renderSkeletonRows(count)}
        </tbody>
      </table>
    </div>
  `;
}

function renderError(): string {
  return `
    <div class="leaderboard-state leaderboard-state--error" role="alert">
      <span class="material-symbols-outlined leaderboard-state__icon" aria-hidden="true">error</span>
      <p class="leaderboard-state__text">Failed to load leaderboard data.</p>
      <button type="button" class="btn btn--retry" data-leaderboard-retry>Try Again</button>
    </div>
  `;
}

function renderEmpty(): string {
  return `
    <div class="leaderboard-state leaderboard-state--empty">
      <span class="material-symbols-outlined leaderboard-state__icon" aria-hidden="true">leaderboard</span>
      <p class="leaderboard-state__text">No leaderboard data available yet.</p>
    </div>
  `;
}

function renderTable(players: ApiLeaderboardEntry[]): string {
  return `
    <div class="leaderboard-wrapper">
      <table class="leaderboard">
        <caption class="visually-hidden">Leaderboard of the top ${players.length} players this week</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Player</th>
            <th scope="col">Games Played</th>
            <th scope="col">Total Score</th>
            <th scope="col">Streak</th>
            <th scope="col">Favorite Game</th>
          </tr>
        </thead>
        <tbody>
          ${players.map(renderRow).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function createLeaderboard(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'players-section';
  section.setAttribute('aria-label', 'Top players');

  const maxVisible = getMaxVisiblePlayers();

  section.innerHTML = `
    <div class="section-header">
      <span class="section-header__bar" aria-hidden="true"></span>
      <h2 class="section-header__title">Top Players</h2>
    </div>
    <div class="leaderboard-content" data-leaderboard-content>
      ${renderSkeleton(maxVisible)}
    </div>
  `;

  loadLeaderboardData(section);

  return section;
}

async function loadLeaderboardData(section: HTMLElement): Promise<void> {
  const content = section.querySelector<HTMLElement>('[data-leaderboard-content]');
  if (!content) return;

  const maxVisible = getMaxVisiblePlayers();
  content.innerHTML = renderSkeleton(maxVisible);

  try {
    const players = await fetchLeaderboard();

    if (players.length === 0) {
      content.innerHTML = renderEmpty();
      return;
    }

    const visiblePlayers = players.slice(0, maxVisible);
    content.innerHTML = renderTable(visiblePlayers);
  } catch {
    content.innerHTML = renderError();
    showSnackbar('Failed to load leaderboard', 'error');

    content.querySelector('[data-leaderboard-retry]')?.addEventListener('click', () => {
      loadLeaderboardData(section);
    });
  }
}
