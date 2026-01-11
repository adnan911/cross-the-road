import { useState, useCallback, useEffect, useRef } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface Coin {
  id: string;
  x: number;
  collected: boolean;
}

export interface Car {
  id: string;
  x: number;
  lane: number;
  speed: number;
  direction: 1 | -1;
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple';
  width: number;
}

export interface Lane {
  type: 'grass' | 'road';
  y: number;
  cars: Car[];
  coins: Coin[];
  speed: number;
  direction: 1 | -1;
}

const GRID_SIZE = 50;
const PLAYER_SIZE = 40;
const CAR_HEIGHT = 35;
const COIN_SIZE = 24;
const GAME_WIDTH = 600;
const VISIBLE_LANES = 12;
const CAR_COLORS: Car['color'][] = ['red', 'blue', 'yellow', 'green', 'purple'];

const generateId = () => Math.random().toString(36).substr(2, 9);

const createLane = (y: number, type: 'grass' | 'road'): Lane => {
  const coins: Coin[] = [];
  
  // Add coins to grass lanes (30% chance per lane, 1-2 coins)
  if (type === 'grass' && y > 0 && Math.random() < 0.3) {
    const numCoins = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numCoins; i++) {
      coins.push({
        id: generateId(),
        x: 50 + Math.random() * (GAME_WIDTH - 100),
        collected: false,
      });
    }
  }
  
  if (type === 'grass') {
    return { type: 'grass', y, cars: [], coins, speed: 0, direction: 1 };
  }
  
  const speed = 1 + Math.random() * 3;
  const direction = Math.random() > 0.5 ? 1 : -1 as 1 | -1;
  const cars: Car[] = [];
  
  // Generate 1-3 cars per road lane
  const numCars = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numCars; i++) {
    const carWidth = 60 + Math.random() * 40;
    cars.push({
      id: generateId(),
      x: Math.random() * GAME_WIDTH,
      lane: y,
      speed,
      direction,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      width: carWidth,
    });
  }
  
  return { type: 'road', y, cars, coins: [], speed, direction };
};

const generateInitialLanes = (): Lane[] => {
  const lanes: Lane[] = [];
  
  // Start with grass
  lanes.push(createLane(0, 'grass'));
  
  // Generate alternating patterns
  for (let i = 1; i < 50; i++) {
    // Pattern: 2-4 roads, then 1-2 grass
    const isRoadSection = Math.random() > 0.25;
    lanes.push(createLane(i, isRoadSection ? 'road' : 'grass'));
  }
  
  return lanes;
};

export const useGameLogic = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: GAME_WIDTH / 2, y: 0 });
  const [lanes, setLanes] = useState<Lane[]>(generateInitialLanes);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('crossyHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [maxY, setMaxY] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isHopping, setIsHopping] = useState(false);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const checkCoinCollection = useCallback((px: number, py: number) => {
    setLanes((prevLanes) => {
      const lane = prevLanes[py];
      if (!lane || lane.type !== 'grass') return prevLanes;

      let collected = false;
      const updatedCoins = lane.coins.map((coin) => {
        if (coin.collected) return coin;
        
        const coinLeft = coin.x - COIN_SIZE / 2;
        const coinRight = coin.x + COIN_SIZE / 2;
        const playerLeft = px - PLAYER_SIZE / 2;
        const playerRight = px + PLAYER_SIZE / 2;
        
        if (playerLeft < coinRight && playerRight > coinLeft) {
          collected = true;
          return { ...coin, collected: true };
        }
        return coin;
      });

      if (collected) {
        setCoinsCollected((c) => c + 1);
        setScore((s) => s + 5); // Bonus 5 points per coin
        return prevLanes.map((l, idx) => 
          idx === py ? { ...l, coins: updatedCoins } : l
        );
      }
      return prevLanes;
    });
  }, []);

  const checkCollision = useCallback((px: number, py: number, currentLanes: Lane[]): boolean => {
    const lane = currentLanes[py];
    if (!lane || lane.type !== 'road') return false;

    const playerLeft = px - PLAYER_SIZE / 2 + 5;
    const playerRight = px + PLAYER_SIZE / 2 - 5;
    const playerTop = py * GRID_SIZE - PLAYER_SIZE / 2 + 5;
    const playerBottom = py * GRID_SIZE + PLAYER_SIZE / 2 - 5;

    for (const car of lane.cars) {
      const carLeft = car.x;
      const carRight = car.x + car.width;
      const carTop = py * GRID_SIZE - CAR_HEIGHT / 2;
      const carBottom = py * GRID_SIZE + CAR_HEIGHT / 2;

      if (
        playerLeft < carRight &&
        playerRight > carLeft &&
        playerTop < carBottom &&
        playerBottom > carTop
      ) {
        return true;
      }
    }
    return false;
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (isGameOver || isHopping) return;

    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 150);

    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up':
          newY = prev.y + 1;
          break;
        case 'down':
          newY = Math.max(0, prev.y - 1);
          break;
        case 'left':
          newX = Math.max(PLAYER_SIZE / 2, prev.x - GRID_SIZE);
          break;
        case 'right':
          newX = Math.min(GAME_WIDTH - PLAYER_SIZE / 2, prev.x + GRID_SIZE);
          break;
      }

      // Generate more lanes if needed
      if (newY > lanes.length - 10) {
        setLanes((prevLanes) => {
          const newLanes = [...prevLanes];
          for (let i = 0; i < 10; i++) {
            const laneY = newLanes.length;
            const isRoad = Math.random() > 0.3;
            newLanes.push(createLane(laneY, isRoad ? 'road' : 'grass'));
          }
          return newLanes;
        });
      }

      // Update score
      if (newY > maxY) {
        setMaxY(newY);
        setScore((s) => s + 1);
      }

      // Check for coin collection after move
      setTimeout(() => checkCoinCollection(newX, newY), 0);

      return { x: newX, y: newY };
    });
  }, [isGameOver, isHopping, lanes.length, maxY, checkCoinCollection]);

  const resetGame = useCallback(() => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: 0 });
    setLanes(generateInitialLanes());
    setScore(0);
    setCoinsCollected(0);
    setMaxY(0);
    setIsGameOver(false);
    setIsHopping(false);
  }, []);

  // Game loop for moving cars
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      
      if (delta > 16) { // ~60fps
        lastTimeRef.current = timestamp;
        
        setLanes((prevLanes) => {
          const newLanes = prevLanes.map((lane) => {
            if (lane.type !== 'road') return lane;
            
            const updatedCars = lane.cars.map((car) => {
              let newX = car.x + car.speed * car.direction;
              
              // Wrap around
              if (car.direction === 1 && newX > GAME_WIDTH + car.width) {
                newX = -car.width;
              } else if (car.direction === -1 && newX < -car.width) {
                newX = GAME_WIDTH + car.width;
              }
              
              return { ...car, x: newX };
            });
            
            return { ...lane, cars: updatedCars };
          });
          
          // Check collision after cars move
          if (!isGameOver && checkCollision(playerPos.x, playerPos.y, newLanes)) {
            setIsGameOver(true);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('crossyHighScore', score.toString());
            }
          }
          
          return newLanes;
        });
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [playerPos, isGameOver, checkCollision, score, highScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, movePlayer, resetGame]);

  return {
    playerPos,
    lanes,
    score,
    coinsCollected,
    highScore,
    isGameOver,
    isHopping,
    movePlayer,
    resetGame,
    GRID_SIZE,
    GAME_WIDTH,
    VISIBLE_LANES,
    PLAYER_SIZE,
    CAR_HEIGHT,
  };
};
