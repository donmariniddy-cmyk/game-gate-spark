export interface GameInfo {
  title: string;
  description: string;
  icon: string;
  slug: string;
  color: string;
  instructions: string;
}

export const games: GameInfo[] = [
  {
    title: "Snake",
    description: "Classic snake game. Eat food, grow longer, don't hit the walls or yourself!",
    icon: "🐍",
    slug: "snake",
    color: "120 100% 50%",
    instructions: "Use arrow keys or WASD to move. Eat the green food to grow!",
  },
  {
    title: "Tic Tac Toe",
    description: "Challenge the AI in this classic strategy game. Can you win?",
    icon: "⭕",
    slug: "tic-tac-toe",
    color: "200 100% 50%",
    instructions: "Click a cell to place your mark. Get 3 in a row to win!",
  },
  {
    title: "Memory Match",
    description: "Test your memory by matching pairs of cards. How fast can you clear the board?",
    icon: "🧠",
    slug: "memory",
    color: "280 100% 60%",
    instructions: "Click cards to flip them. Match all pairs to win!",
  },
  {
    title: "2048",
    description: "Slide tiles to combine numbers. Reach 2048 to win this addictive puzzle!",
    icon: "🔢",
    slug: "2048",
    color: "30 100% 50%",
    instructions: "Use arrow keys to slide tiles. Combine matching numbers!",
  },
  {
    title: "Call of Duty",
    description: "Experience intense FPS combat with epic multiplayer battles and stunning graphics.",
    icon: "🔫",
    slug: "call-of-duty",
    color: "0 80% 45%",
    instructions: "Tactical shooter with multiplayer modes. Download to play!",
  },
  {
    title: "PUBG",
    description: "Battle royale action — drop in, loot up, and be the last one standing.",
    icon: "🪖",
    slug: "pubg",
    color: "45 90% 50%",
    instructions: "100-player battle royale. Survive to win!",
  },
  {
    title: "Beach Buggy Racing",
    description: "Wild kart racing on tropical beaches with powerups and crazy shortcuts.",
    icon: "🏖️",
    slug: "beach-buggy-racing",
    color: "190 90% 55%",
    instructions: "Race through exotic tracks with powerups and stunts!",
  },
  {
    title: "CarX Street",
    description: "Open-world street racing with realistic physics and deep car customization.",
    icon: "🏎️",
    slug: "carx-street",
    color: "350 85% 50%",
    instructions: "Street race with realistic drifting and tuning!",
  },
  {
    title: "Free Fire",
    description: "Fast-paced battle royale with unique characters and abilities.",
    icon: "🔥",
    slug: "free-fire",
    color: "15 100% 55%",
    instructions: "10-minute survival shooter. Be the last one standing!",
  },
  {
    title: "Car Parking Multiplayer",
    description: "Open-world driving and parking simulator with real-time multiplayer.",
    icon: "🅿️",
    slug: "car-parking-multiplayer",
    color: "220 80% 55%",
    instructions: "Park, cruise, and customize cars in multiplayer!",
  },
  {
    title: "DLS 2026",
    description: "Dream League Soccer — build your dream team and dominate the league.",
    icon: "⚽",
    slug: "dls-2026",
    color: "130 85% 45%",
    instructions: "Manage and play your dream football team!",
  },
  {
    title: "eFootball",
    description: "Console-quality football experience with realistic gameplay and licensed teams.",
    icon: "🏟️",
    slug: "efootball",
    color: "210 90% 50%",
    instructions: "Play realistic football with licensed clubs and players!",
  },
  {
    title: "NFS No Limits",
    description: "High-octane street racing from the legendary Need for Speed franchise.",
    icon: "💨",
    slug: "nfs-no-limits",
    color: "260 85% 55%",
    instructions: "Race, drift, and customize supercars in underground races!",
  },
  {
    title: "Bus Simulator Ultimate",
    description: "Drive buses across countries, build your transport empire.",
    icon: "🚌",
    slug: "bus-simulator-ultimate",
    color: "50 80% 50%",
    instructions: "Drive realistic buses and manage your company!",
  },
  {
    title: "SSR",
    description: "Super Street Racer — underground racing with stunning visuals and tuning.",
    icon: "🏁",
    slug: "ssr",
    color: "300 80% 50%",
    instructions: "Race and customize cars in street competitions!",
  },
];
