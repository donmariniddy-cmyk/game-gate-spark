import { useState, useEffect, useCallback, useRef } from "react";

const LANE_COUNT = 3;
const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;
const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;
const PLAYER_SIZE = 40;
const OBSTACLE_SIZE = 40;
const COIN_SIZE = 20;
const INITIAL_SPEED = 3;
const SPEED_INCREMENT = 0.002;

interface Obstacle {
  lane: number;
  y: number;
  type: "rock" | "fire";
}

interface Coin {
  lane: number;
  y: number;
  collected: boolean;
}

const TempleRunGame = () => {
  const [playerLane, setPlayerLane] = useState(1);
  const [jumping, setJumping] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [score, setScore] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const animRef = useRef<number>();
  const lastObstacle = useRef(0);
  const lastCoin = useRef(0);
  const jumpY = useRef(0);
  const jumpPhase = useRef(0);

  const resetGame = useCallback(() => {
    setPlayerLane(1);
    setJumping(false);
    setSliding(false);
    setObstacles([]);
    setCoins([]);
    setScore(0);
    setCoinCount(0);
    setGameOver(false);
    setSpeed(INITIAL_SPEED);
    lastObstacle.current = 0;
    lastCoin.current = 0;
    jumpY.current = 0;
    jumpPhase.current = 0;
  }, []);

  const startGame = () => {
    resetGame();
    setStarted(true);
  };

  // Controls
  useEffect(() => {
    if (!started || gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") setPlayerLane((l) => Math.max(0, l - 1));
      if (e.key === "ArrowRight" || e.key === "d") setPlayerLane((l) => Math.min(2, l + 1));
      if (e.key === "ArrowUp" || e.key === "w") { setJumping(true); jumpPhase.current = 0; }
      if (e.key === "ArrowDown" || e.key === "s") setSliding(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s") setSliding(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("keyup", handleKeyUp); };
  }, [started, gameOver]);

  // Touch controls
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!started || gameOver) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) setPlayerLane((l) => Math.min(2, l + 1));
        else if (dx < -30) setPlayerLane((l) => Math.max(0, l - 1));
      } else {
        if (dy < -30) { setJumping(true); jumpPhase.current = 0; }
        else if (dy > 30) setSliding(true);
      }
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => { window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [started, gameOver]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;

    const tick = () => {
      setSpeed((s) => s + SPEED_INCREMENT);
      setScore((s) => s + 1);

      // Jump arc
      if (jumping) {
        jumpPhase.current += 0.08;
        jumpY.current = Math.sin(jumpPhase.current) * 50;
        if (jumpPhase.current >= Math.PI) {
          setJumping(false);
          jumpY.current = 0;
          jumpPhase.current = 0;
        }
      }

      // Spawn obstacles
      lastObstacle.current += speed;
      if (lastObstacle.current > 120) {
        lastObstacle.current = 0;
        const lane = Math.floor(Math.random() * LANE_COUNT);
        setObstacles((prev) => [...prev, { lane, y: -OBSTACLE_SIZE, type: Math.random() > 0.5 ? "rock" : "fire" }]);
      }

      // Spawn coins
      lastCoin.current += speed;
      if (lastCoin.current > 80) {
        lastCoin.current = 0;
        const lane = Math.floor(Math.random() * LANE_COUNT);
        setCoins((prev) => [...prev, { lane, y: -COIN_SIZE, collected: false }]);
      }

      // Move obstacles
      setObstacles((prev) => {
        const next = prev.map((o) => ({ ...o, y: o.y + speed })).filter((o) => o.y < GAME_HEIGHT + 50);
        return next;
      });

      // Move coins
      setCoins((prev) => {
        const next = prev.map((c) => ({ ...c, y: c.y + speed })).filter((c) => c.y < GAME_HEIGHT + 50);
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [started, gameOver, jumping, speed]);

  // Collision detection
  useEffect(() => {
    if (!started || gameOver) return;

    const playerX = playerLane * LANE_WIDTH + LANE_WIDTH / 2;
    const playerY = GAME_HEIGHT - 70 - jumpY.current;
    const playerH = sliding ? PLAYER_SIZE / 2 : PLAYER_SIZE;

    // Check obstacles
    for (const o of obstacles) {
      const ox = o.lane * LANE_WIDTH + LANE_WIDTH / 2;
      const oy = o.y;
      if (
        Math.abs(playerX - ox) < (PLAYER_SIZE + OBSTACLE_SIZE) / 2 - 8 &&
        Math.abs(playerY - oy) < (playerH + OBSTACLE_SIZE) / 2 - 8
      ) {
        if (jumping && o.type === "rock") continue; // can jump over rocks
        if (sliding && o.type === "fire") continue; // can slide under fire
        setGameOver(true);
        return;
      }
    }

    // Check coins
    setCoins((prev) =>
      prev.map((c) => {
        if (c.collected) return c;
        const cx = c.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const cy = c.y;
        if (Math.abs(playerX - cx) < (PLAYER_SIZE + COIN_SIZE) / 2 && Math.abs(playerY - cy) < (PLAYER_SIZE + COIN_SIZE) / 2) {
          setCoinCount((cc) => cc + 1);
          return { ...c, collected: true };
        }
        return c;
      })
    );
  }, [obstacles, coins, playerLane, jumping, sliding, gameOver, started]);

  const playerX = playerLane * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2;
  const playerY = GAME_HEIGHT - 70 - jumpY.current;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score display */}
      <div className="flex gap-6 text-sm font-heading">
        <span className="text-foreground">Score: <span className="neon-text">{score}</span></span>
        <span className="text-foreground">Coins: <span className="text-yellow-400">🪙 {coinCount}</span></span>
      </div>

      {/* Game area */}
      <div
        className="relative overflow-hidden rounded-xl border border-border"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: "linear-gradient(180deg, hsl(30 40% 15%) 0%, hsl(25 50% 10%) 100%)" }}
      >
        {/* Lane lines */}
        {[1, 2].map((i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-yellow-900/30" style={{ left: i * LANE_WIDTH }} />
        ))}

        {/* Scrolling ground pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, hsl(30 30% 30%) 40px, hsl(30 30% 30%) 42px)",
          backgroundPositionY: `${score % 42}px`,
        }} />

        {!started ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
            <span className="text-5xl">🏃</span>
            <h3 className="font-heading text-xl font-bold text-foreground">Temple Run</h3>
            <p className="text-muted-foreground text-xs text-center px-6">Swipe or use arrow keys to dodge obstacles and collect coins!</p>
            <button onClick={startGame} className="bg-primary text-primary-foreground font-heading font-bold px-6 py-2 rounded-md text-sm tracking-wider hover:shadow-[0_0_20px_hsl(120_100%_50%/0.5)] transition-all">
              START RUNNING
            </button>
          </div>
        ) : (
          <>
            {/* Obstacles */}
            {obstacles.map((o, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center text-2xl"
                style={{
                  left: o.lane * LANE_WIDTH + LANE_WIDTH / 2 - OBSTACLE_SIZE / 2,
                  top: o.y,
                  width: OBSTACLE_SIZE,
                  height: OBSTACLE_SIZE,
                }}
              >
                {o.type === "rock" ? "🪨" : "🔥"}
              </div>
            ))}

            {/* Coins */}
            {coins.filter((c) => !c.collected).map((c, i) => (
              <div
                key={`c${i}`}
                className="absolute flex items-center justify-center text-lg"
                style={{
                  left: c.lane * LANE_WIDTH + LANE_WIDTH / 2 - COIN_SIZE / 2,
                  top: c.y,
                  width: COIN_SIZE,
                  height: COIN_SIZE,
                }}
              >
                🪙
              </div>
            ))}

            {/* Player */}
            <div
              className="absolute flex items-center justify-center transition-[left] duration-100"
              style={{
                left: playerX,
                top: playerY,
                width: PLAYER_SIZE,
                height: sliding ? PLAYER_SIZE / 2 : PLAYER_SIZE,
                fontSize: sliding ? "20px" : "28px",
              }}
            >
              {sliding ? "🏃" : "🏃‍♂️"}
            </div>

            {/* Game over overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4 z-20">
                <h3 className="font-heading text-2xl font-bold text-destructive">GAME OVER</h3>
                <p className="text-foreground text-sm">Score: <span className="neon-text font-bold">{score}</span></p>
                <p className="text-foreground text-sm">Coins: <span className="text-yellow-400 font-bold">🪙 {coinCount}</span></p>
                <button onClick={startGame} className="bg-primary text-primary-foreground font-heading font-bold px-6 py-2 rounded-md text-sm tracking-wider hover:shadow-[0_0_20px_hsl(120_100%_50%/0.5)] transition-all">
                  TRY AGAIN
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 w-[200px] md:hidden">
        <div />
        <button onTouchStart={() => { setJumping(true); jumpPhase.current = 0; }} className="bg-secondary text-foreground font-bold py-3 rounded-lg text-xs">↑ JUMP</button>
        <div />
        <button onTouchStart={() => setPlayerLane((l) => Math.max(0, l - 1))} className="bg-secondary text-foreground font-bold py-3 rounded-lg text-xs">← LEFT</button>
        <button onTouchStart={() => setSliding(true)} onTouchEnd={() => setSliding(false)} className="bg-secondary text-foreground font-bold py-3 rounded-lg text-xs">↓ SLIDE</button>
        <button onTouchStart={() => setPlayerLane((l) => Math.min(2, l + 1))} className="bg-secondary text-foreground font-bold py-3 rounded-lg text-xs">→ RIGHT</button>
      </div>

      <p className="text-muted-foreground text-xs text-center">Arrow keys: Move/Jump/Slide • Jump over 🪨 rocks • Slide under 🔥 fire</p>
    </div>
  );
};

export default TempleRunGame;
