import gamesSeed from './games-seed.json';
import vacationCafeSimulatorCard from '../assets/images/vacation-cafe-simulator-card.jpg';
import winterBurrowCard from '../assets/images/winter-burrow-card.jpg';
import shelveThePotionsCard from '../assets/images/shelve-the-potions-card.jpg';
import heartopiaCard from '../assets/images/heartopia-card.jpg';
import paliaCard from '../assets/images/palia-card.jpg';
import catMailCoCard from '../assets/images/cat-mail-co-card.jpg';
import leafItAloneCard from '../assets/images/leaf-it-alone-card.jpg';
import leafyCornerCard from '../assets/images/leafy-corner-card.jpg';
import grimshireCard from '../assets/images/grimshire-card.jpg';
import tinyGladeCard from '../assets/images/tiny-glade-card.jpg';
import whisperOfTheHouseCard from '../assets/images/whisper-of-the-house-card.jpg';
import tukoniForestKeepersCard from '../assets/images/tukoni-forest-keepers-card.jpg';
import catChessCard from '../assets/images/cat-chess-card.jpg';
import castNChillCard from '../assets/images/cast-n-chill-card.jpg';
import littleCornersCard from '../assets/images/little-corners-card.jpg';
import tailsideCozyCafeSimCard from '../assets/images/tailside-cozy-cafe-sim-card.jpg';
import islandersNewShoresCard from '../assets/images/islanders-new-shores-card.jpg';
import camperVanMakeItHomeCard from '../assets/images/camper-van-make-it-home-card.jpg';
import organizedInsideCard from '../assets/images/organized-inside-card.jpg';
import cozySolitaireCard from '../assets/images/cozy-solitaire-card.jpg';
import cozySudokuCard from '../assets/images/cozy-sudoku-card.jpg';
import koronekoCard from '../assets/images/koroneko-card.jpg';
import wytchwoodCard from '../assets/images/wytchwood-card.jpg';
import theWildAtHeartCard from '../assets/images/the-wild-at-heart-card.jpg';

export interface GameSeedEntry {
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

export interface Game extends GameSeedEntry {
  image: string;
}

const CARD_IMAGES: Record<string, string> = {
  'vacation-cafe-simulator': vacationCafeSimulatorCard,
  'winter-burrow': winterBurrowCard,
  'shelve-the-potions': shelveThePotionsCard,
  heartopia: heartopiaCard,
  palia: paliaCard,
  'cat-mail-co': catMailCoCard,
  'leaf-it-alone': leafItAloneCard,
  'leafy-corner': leafyCornerCard,
  grimshire: grimshireCard,
  'tiny-glade': tinyGladeCard,
  'whisper-of-the-house': whisperOfTheHouseCard,
  'tukoni-forest-keepers': tukoniForestKeepersCard,
  'cat-chess': catChessCard,
  'cast-n-chill': castNChillCard,
  'little-corners': littleCornersCard,
  'tailside-cozy-cafe-sim': tailsideCozyCafeSimCard,
  'islanders-new-shores': islandersNewShoresCard,
  'camper-van-make-it-home': camperVanMakeItHomeCard,
  'organized-inside': organizedInsideCard,
  'cozy-solitaire': cozySolitaireCard,
  'cozy-sudoku': cozySudokuCard,
  koroneko: koronekoCard,
  wytchwood: wytchwoodCard,
  'the-wild-at-heart': theWildAtHeartCard,
};

export const GAMES: Game[] = (gamesSeed.data as GameSeedEntry[])
  .filter((game) => CARD_IMAGES[game.slug])
  .map((game) => ({ ...game, image: CARD_IMAGES[game.slug] }));

export function formatLikes(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count);
}
