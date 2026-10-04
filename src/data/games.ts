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

import vacationCafeSimulatorHero from '../assets/images/vacation-cafe-simulator-hero.jpg';
import winterBurrowHero from '../assets/images/winter-burrow-hero.jpg';
import shelveThePotionsHero from '../assets/images/shelve-the-potions-hero.jpg';
import heartopiaHero from '../assets/images/heartopia-hero.jpg';
import paliaHero from '../assets/images/palia-hero.jpg';
import catMailCoHero from '../assets/images/cat-mail-co-hero.jpg';
import leafItAloneHero from '../assets/images/leaf-it-alone-hero.jpg';
import leafyCornerHero from '../assets/images/leafy-corner-hero.jpg';
import grimshireHero from '../assets/images/grimshire-hero.jpg';
import tinyGladeHero from '../assets/images/tiny-glade-hero.jpg';
import whisperOfTheHouseHero from '../assets/images/whisper-of-the-house-hero.jpg';
import tukoniForestKeepersHero from '../assets/images/tukoni-forest-keepers-hero.jpg';
import catChessHero from '../assets/images/cat-chess-hero.jpg';
import castNChillHero from '../assets/images/cast-n-chill-hero.jpg';
import littleCornersHero from '../assets/images/little-corners-hero.jpg';
import tailsideCozyCafeSimHero from '../assets/images/tailside-cozy-cafe-sim-hero.jpg';
import islandersNewShoresHero from '../assets/images/islanders-new-shores-hero.jpg';
import camperVanMakeItHomeHero from '../assets/images/camper-van-make-it-home-hero.jpg';
import organizedInsideHero from '../assets/images/organized-inside-hero.jpg';
import cozySolitaireHero from '../assets/images/cozy-solitaire-hero.jpg';
import cozySudokuHero from '../assets/images/cozy-sudoku-hero.jpg';
import koronekoHero from '../assets/images/koroneko-hero.jpg';
import wytchwoodHero from '../assets/images/wytchwood-hero.jpg';
import theWildAtHeartHero from '../assets/images/the-wild-at-heart-hero.jpg';

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

const HERO_IMAGES: Record<string, string> = {
  'vacation-cafe-simulator': vacationCafeSimulatorHero,
  'winter-burrow': winterBurrowHero,
  'shelve-the-potions': shelveThePotionsHero,
  heartopia: heartopiaHero,
  palia: paliaHero,
  'cat-mail-co': catMailCoHero,
  'leaf-it-alone': leafItAloneHero,
  'leafy-corner': leafyCornerHero,
  grimshire: grimshireHero,
  'tiny-glade': tinyGladeHero,
  'whisper-of-the-house': whisperOfTheHouseHero,
  'tukoni-forest-keepers': tukoniForestKeepersHero,
  'cat-chess': catChessHero,
  'cast-n-chill': castNChillHero,
  'little-corners': littleCornersHero,
  'tailside-cozy-cafe-sim': tailsideCozyCafeSimHero,
  'islanders-new-shores': islandersNewShoresHero,
  'camper-van-make-it-home': camperVanMakeItHomeHero,
  'organized-inside': organizedInsideHero,
  'cozy-solitaire': cozySolitaireHero,
  'cozy-sudoku': cozySudokuHero,
  koroneko: koronekoHero,
  wytchwood: wytchwoodHero,
  'the-wild-at-heart': theWildAtHeartHero,
};

export function getGameHeroImage(slug: string): string {
  return HERO_IMAGES[slug] ?? '';
}

export interface GameDetail {
  description: string;
  players: string;
  duration: string;
}

const GAME_DETAILS: Record<string, GameDetail> = {
  'vacation-cafe-simulator': {
    description:
      'Run your dream Italian vacation cafe with no timers or stress. Cook traditional dishes, upgrade your kitchen, and customize your cozy seaside restaurant.',
    players: 'Single Player',
    duration: '15-30 min',
  },
  'winter-burrow': {
    description:
      'A cozy woodland survival game about a mouse restoring their childhood burrow. Explore snowy forests, gather resources, craft items, and befriend woodland creatures.',
    players: 'Single Player',
    duration: '20-40 min',
  },
  'shelve-the-potions': {
    description:
      'Sort and organize magical potions on enchanted shelves. A satisfying puzzle game where every bottle has its perfect place in your apothecary.',
    players: 'Single Player',
    duration: '10-20 min',
  },
  heartopia: {
    description:
      'Build and nurture a heartfelt community in this wholesome life simulator. Grow gardens, decorate homes, and form friendships in a pastel paradise.',
    players: '1-2 Players',
    duration: '20-45 min',
  },
  palia: {
    description:
      'A cozy community sim where you can build your home, tend gardens, go fishing, cook recipes, and forge friendships in a beautiful open world.',
    players: 'Multiplayer',
    duration: '30-60 min',
  },
  'cat-mail-co': {
    description:
      'Manage a mail delivery company run entirely by cats. Sort packages, plan routes, and make sure every parcel reaches its destination on time.',
    players: 'Single Player',
    duration: '10-25 min',
  },
  'leaf-it-alone': {
    description:
      'A calming card-based solitaire game with a nature twist. Arrange leaves and flowers in peaceful patterns to clear each beautifully illustrated board.',
    players: 'Single Player',
    duration: '5-15 min',
  },
  'leafy-corner': {
    description:
      'Tend to your indoor plant collection in this relaxing sim. Water, prune, repot, and watch your leafy friends thrive in your cozy apartment corner.',
    players: 'Single Player',
    duration: '10-20 min',
  },
  grimshire: {
    description:
      'A whimsical strategy game set in a quirky gothic village. Manage resources, build structures, and unravel mysteries in a charmingly spooky world.',
    players: '1-4 Players',
    duration: '25-50 min',
  },
  'tiny-glade': {
    description:
      'A small castle doodling game. Build beautiful little structures in a peaceful meadow with no objectives, just pure creative relaxation.',
    players: 'Single Player',
    duration: '10-30 min',
  },
  'whisper-of-the-house': {
    description:
      'Explore an old house full of secrets and gentle puzzles. Uncover the stories hidden in every room of this atmospheric point-and-click adventure.',
    players: 'Single Player',
    duration: '15-30 min',
  },
  'tukoni-forest-keepers': {
    description:
      'Guide tiny forest spirits through enchanted woodlands. A heartwarming point-and-click puzzle adventure with hand-painted art and gentle storytelling.',
    players: 'Single Player',
    duration: '20-40 min',
  },
  'cat-chess': {
    description:
      'Classic chess reimagined with adorable cat pieces. Learn strategy, solve puzzles, and challenge friends in this purrfectly delightful take on the timeless game.',
    players: '1-2 Players',
    duration: '10-30 min',
  },
  'cast-n-chill': {
    description:
      'Cast your line and relax by the water in this peaceful fishing game. Discover rare fish, upgrade your gear, and enjoy the serene lakeside scenery.',
    players: 'Single Player',
    duration: '15-30 min',
  },
  'little-corners': {
    description:
      'A minimalist puzzle game about fitting shapes into cozy corners. Simple rules, elegant design, and increasingly clever challenges to unwind with.',
    players: 'Single Player',
    duration: '5-15 min',
  },
  'tailside-cozy-cafe-sim': {
    description:
      'Run a charming cafe where animal friends are your customers. Brew coffee, bake treats, decorate your shop, and build a loyal community of regulars.',
    players: 'Single Player',
    duration: '15-30 min',
  },
  'islanders-new-shores': {
    description:
      'Build beautiful island villages with strategic placement. A relaxing city-builder with no deadlines — just thoughtful placement and growing communities.',
    players: 'Single Player',
    duration: '20-40 min',
  },
  'camper-van-make-it-home': {
    description:
      'Renovate and customize your dream camper van, then hit the open road. Visit scenic spots, cook campfire meals, and enjoy the journey home.',
    players: 'Single Player',
    duration: '15-35 min',
  },
  'organized-inside': {
    description:
      'The ultimate tidying-up puzzle game. Sort, stack, and organize household items into satisfying arrangements. Every drawer and shelf is a new challenge.',
    players: 'Single Player',
    duration: '10-20 min',
  },
  'cozy-solitaire': {
    description:
      'Classic solitaire wrapped in warm, cozy visuals. Enjoy multiple game modes with seasonal themes, gentle music, and a relaxing card-playing experience.',
    players: 'Single Player',
    duration: '5-15 min',
  },
  'cozy-sudoku': {
    description:
      'Sudoku puzzles with a cozy aesthetic. Choose from easy to expert difficulty, enjoy calming backgrounds, and track your progress across hundreds of puzzles.',
    players: 'Single Player',
    duration: '5-20 min',
  },
  koroneko: {
    description:
      'Follow an adventurous cat through a series of charming arcade challenges. Jump, dash, and collect treats in beautifully crafted pixel-art worlds.',
    players: 'Single Player',
    duration: '10-25 min',
  },
  wytchwood: {
    description:
      'A crafting adventure game set in a land of gothic fairytales. Explore strange lands, gather ingredients, brew recipes, and outwit a cast of storybook characters.',
    players: 'Single Player',
    duration: '25-50 min',
  },
  'the-wild-at-heart': {
    description:
      'Lead a band of quirky creatures through a beautiful wilderness. Solve puzzles, battle strange monsters, and uncover the mysteries of the Deep Woods.',
    players: 'Single Player',
    duration: '20-45 min',
  },
};

export function getGameDetail(slug: string): GameDetail {
  return (
    GAME_DETAILS[slug] ?? {
      description: 'An exciting mini-game waiting to be discovered. Jump in and start playing!',
      players: 'Single Player',
      duration: '10-20 min',
    }
  );
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

export function getGameCardImage(slug: string): string {
  return CARD_IMAGES[slug] ?? '';
}

export const GAMES: Game[] = (gamesSeed.data as GameSeedEntry[])
  .filter((game) => CARD_IMAGES[game.slug])
  .map((game) => ({ ...game, image: CARD_IMAGES[game.slug] }));

export function formatLikes(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count);
}
