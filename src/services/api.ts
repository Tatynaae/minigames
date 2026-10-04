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

export interface ApiCategory {
  slug: string;
  label: string;
  isDefault: boolean;
}

interface CategoriesResponse {
  data: ApiCategory[];
  meta: { totalItems: number; description: string };
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const result = await fetchJson<CategoriesResponse>(`${API_BASE}/api/categories`);
  return result.data;
}

export interface ApiGame {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
}

export interface GamesPageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  appliedFilter: { category: string; sort: string };
}

export interface GamesPageResult {
  data: ApiGame[];
  meta: GamesPageMeta;
}

export interface FetchGamesParams {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function fetchGames(params: FetchGamesParams = {}): Promise<GamesPageResult> {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  return fetchJson<GamesPageResult>(`${API_BASE}/api/games?${query.toString()}`);
}

export interface ApiGameDetailSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface ApiTopRecord {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
}

export interface ApiGameDetail {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: ApiGameDetailSpecs;
  topRecords: ApiTopRecord[];
}

export async function fetchGameDetail(slug: string, userEmail?: string): Promise<ApiGameDetail> {
  const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : '';
  const result = await fetchJson<{ data: ApiGameDetail }>(`${API_BASE}/api/games/${slug}${query}`);
  return result.data;
}

export interface ApiComment {
  commentId: string;
  authorName: string;
  text: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
}

export interface CommentsResult {
  data: ApiComment[];
  meta: { totalComments: number; returnedCount: number; sort: string };
}

export async function fetchGameComments(
  slug: string,
  limit = 3,
  sort = 'newest',
  userEmail?: string,
): Promise<CommentsResult> {
  const query = new URLSearchParams({ limit: String(limit), sort });
  if (userEmail) query.set('userEmail', userEmail);
  return fetchJson<CommentsResult>(`${API_BASE}/api/games/${slug}/comments?${query.toString()}`);
}
