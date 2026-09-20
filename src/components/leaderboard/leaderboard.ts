import './leaderboard.scss';
import leaderboardData from '../../data/leaderboard.json';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  gamesPlayed: number;
  totalScore: number;
  streakDays: number;
  favoriteGameSlug: string;
  favoriteGameName: string;
}

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

function renderRow(player: LeaderboardEntry, index: number): string {
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
      <td><span class="leaderboard__streak">🔥 ${player.streakDays} days</span></td>
      <td><span class="leaderboard__game-tag">${player.favoriteGameName}</span></td>
    </tr>
  `;
}

export function createLeaderboard(): HTMLElement {
  const players = leaderboardData.data as LeaderboardEntry[];

  const section = document.createElement('section');
  section.className = 'players-section';
  section.setAttribute('aria-label', 'Top players');
  section.innerHTML = `
    <div class="section-header">
      <span class="section-header__bar" aria-hidden="true"></span>
      <h2 class="section-header__title">Top Players</h2>
    </div>

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

  return section;
}
