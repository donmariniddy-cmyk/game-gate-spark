export interface Html5Game {
  id: string;
  title: string;
  description: string;
  category: "action" | "puzzle" | "racing" | "arcade" | "strategy";
  thumbnail: string;
  embedUrl: string;
  isPopular?: boolean;
  isNew?: boolean;
  rating: number;
}

export const html5Games: Html5Game[] = [
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Classic number puzzle. Fill the grid so every row, column, and box contains 1-9.",
    category: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/sudoku/",
    isPopular: true,
    rating: 4.7,
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    description: "The legendary puzzle game. Uncover all safe squares without hitting a mine!",
    category: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/minesweeper/",
    isPopular: true,
    rating: 4.5,
  },
  {
    id: "solitaire",
    title: "Solitaire",
    description: "The classic card game. Stack cards in descending order, alternating colors.",
    category: "strategy",
    thumbnail: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/solitaire/",
    isPopular: true,
    rating: 4.6,
  },
  {
    id: "tetris",
    title: "Block Puzzle",
    description: "Arrange falling blocks to complete rows in this addictive puzzle classic.",
    category: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1493476523860-a6de6ce1b0c3?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/block-puzzle/",
    isNew: true,
    rating: 4.4,
  },
  {
    id: "mahjong",
    title: "Mahjong",
    description: "Match pairs of tiles to clear the board in this relaxing strategy game.",
    category: "strategy",
    thumbnail: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/mahjong/",
    isPopular: true,
    rating: 4.3,
  },
  {
    id: "word-search",
    title: "Word Search",
    description: "Find hidden words in a grid of letters. Fun and educational!",
    category: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1579309401389-a2476dddf3d4?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/word-search/",
    isNew: true,
    rating: 4.1,
  },
  {
    id: "checkers",
    title: "Checkers",
    description: "Classic board game. Jump over your opponent's pieces to capture them!",
    category: "strategy",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/checkers/",
    isNew: true,
    rating: 4.2,
  },
  {
    id: "snake",
    title: "Snake",
    description: "Guide the snake to eat food and grow longer without hitting the walls!",
    category: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
    embedUrl: "https://playpager.com/embed/snake/",
    isNew: true,
    rating: 4.0,
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    description: "Race through challenging tracks on a powerful motorbike. Perform stunts and beat the clock!",
    category: "racing",
    thumbnail: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/moto-x3m",
    isPopular: true,
    rating: 4.7,
  },
  {
    id: "highway-traffic",
    title: "Highway Traffic",
    description: "Weave through fast-moving highway traffic at breakneck speeds. How far can you go?",
    category: "racing",
    thumbnail: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/highway-traffic",
    isNew: true,
    rating: 4.5,
  },
  {
    id: "madalin-stunt-cars",
    title: "Madalin Stunt Cars 2",
    description: "Drive supercars across massive stunt arenas with ramps, loops, and jumps.",
    category: "racing",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/madalin-stunt-cars-2",
    isPopular: true,
    rating: 4.6,
  },
  {
    id: "drift-hunters",
    title: "Drift Hunters",
    description: "Master the art of drifting in tuned-up cars across multiple tracks. Earn cash and upgrade.",
    category: "racing",
    thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/drift-hunters",
    isPopular: true,
    rating: 4.8,
  },
];

export const categories = [
  { value: "all", label: "All Games" },
  { value: "action", label: "Action" },
  { value: "puzzle", label: "Puzzle" },
  { value: "racing", label: "Racing" },
  { value: "arcade", label: "Arcade" },
  { value: "strategy", label: "Strategy" },
] as const;
