const API_BASE = 'https://faxb76kxra.execute-api.eu-central-1.amazonaws.com';

export interface ApiFeaturedGame {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
}

interface FeaturedGamesResponse {
  data: ApiFeaturedGame[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    appliedFilter: { featured: boolean };
  };
}

export interface ApiLeaderboardEntry {
  rank: number;
  playerName: string;
  gamesPlayed: number;
  totalScore: number;
  streakDays: number;
  favoriteGameSlug: string;
  favoriteGameName: string;
}

interface LeaderboardResponse {
  data: ApiLeaderboardEntry[];
  meta: {
    totalItems: number;
    description: string;
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as Promise<T>;
}

export async function fetchFeaturedGames(): Promise<ApiFeaturedGame[]> {
  const result = await fetchJson<FeaturedGamesResponse>(`${API_BASE}/api/games?featured=true`);
  return result.data;
}

export async function fetchLeaderboard(): Promise<ApiLeaderboardEntry[]> {
  const result = await fetchJson<LeaderboardResponse>(`${API_BASE}/api/leaderboard`);
  return result.data;
}
