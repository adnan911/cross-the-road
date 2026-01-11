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

export type PowerUpType = 'invincibility' | 'magnet' | 'slowmo';

export interface PowerUp {
  id: string;
  x: number;
  type: PowerUpType;
  collected: boolean;
}

export interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
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

export interface Log {
  id: string;
  x: number;
  width: number;
  speed: number;
  direction: 1 | -1;
}

export interface Lane {
  type: 'grass' | 'road' | 'water';
  y: number;
  cars: Car[];
  coins: Coin[];
  logs: Log[];
  powerUps: PowerUp[];
  speed: number;
  direction: 1 | -1;
}

export type SkinType = 'chicken' | 'duck' | 'frog' | 'bunny' | 'cat' | 'panda' | 'fox' | 'penguin';

export interface UnlockableSkin {
  id: SkinType;
  name: string;
  requirement: { type: 'coins' | 'score'; value: number };
  color: string;
  unlocked: boolean;
}

const GRID_SIZE = 50;
const PLAYER_SIZE = 40;
const CAR_HEIGHT = 35;
const COIN_SIZE = 24;
const LOG_HEIGHT = 40;
const POWER_UP_SIZE = 32;
const POWER_UP_DURATION = 5000; // 5 seconds
const MAGNET_RANGE = 150;
const GAME_WIDTH = Math.min(400, window.innerWidth - 16); // Mobile-first width
const VISIBLE_LANES = 10; // Fewer lanes for mobile
const CAR_COLORS: Car['color'][] = ['red', 'blue', 'yellow', 'green', 'purple'];
const POWER_UP_TYPES: PowerUpType[] = ['invincibility', 'magnet', 'slowmo'];

const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_SKINS: UnlockableSkin[] = [
  { id: 'chicken', name: 'Chicken', requirement: { type: 'coins', value: 0 }, color: '#FFD93D', unlocked: true },
  { id: 'duck', name: 'Duck', requirement: { type: 'coins', value: 15 }, color: '#FFA500', unlocked: false },
  { id: 'frog', name: 'Frog', requirement: { type: 'coins', value: 35 }, color: '#4CAF50', unlocked: false },
  { id: 'bunny', name: 'Bunny', requirement: { type: 'score', value: 40 }, color: '#FFB6C1', unlocked: false },
  { id: 'cat', name: 'Cat', requirement: { type: 'score', value: 75 }, color: '#808080', unlocked: false },
  { id: 'panda', name: 'Panda', requirement: { type: 'coins', value: 60 }, color: '#FFFFFF', unlocked: false },
  { id: 'fox', name: 'Fox', requirement: { type: 'score', value: 120 }, color: '#FF6B35', unlocked: false },
  { id: 'penguin', name: 'Penguin', requirement: { type: 'coins', value: 100 }, color: '#1A1A2E', unlocked: false },
];

const createLane = (y: number, type: 'grass' | 'road' | 'water'): Lane => {
  const coins: Coin[] = [];
  const powerUps: PowerUp[] = [];
  
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
  
  // Add power-ups to grass lanes (10% chance per lane)
  if (type === 'grass' && y > 0 && Math.random() < 0.1) {
    powerUps.push({
      id: generateId(),
      x: 50 + Math.random() * (GAME_WIDTH - 100),
      type: POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)],
      collected: false,
    });
  }
  
  if (type === 'grass') {
    return { type: 'grass', y, cars: [], coins, logs: [], powerUps, speed: 0, direction: 1 };
  }
  
  if (type === 'water') {
    const speed = 1 + Math.random() * 1.5; // Slower for mobile
    const direction = Math.random() > 0.5 ? 1 : -1 as 1 | -1;
    const logs: Log[] = [];
    
    // Generate 2-3 logs per water lane
    const numLogs = 2 + Math.floor(Math.random() * 2);
    const logSpacing = GAME_WIDTH / numLogs;
    for (let i = 0; i < numLogs; i++) {
      logs.push({
        id: generateId(),
        x: i * logSpacing + Math.random() * (logSpacing / 2),
        width: 70 + Math.random() * 30, // Slightly smaller for mobile
        speed,
        direction,
      });
    }
    
    return { type: 'water', y, cars: [], coins: [], logs, powerUps: [], speed, direction };
  }
  
  const speed = 1 + Math.random() * 2; // Slower cars for mobile
  const direction = Math.random() > 0.5 ? 1 : -1 as 1 | -1;
  const cars: Car[] = [];
  
  // Generate 1-2 cars per road lane
  const numCars = 1 + Math.floor(Math.random() * 1);
  for (let i = 0; i < numCars; i++) {
    const carWidth = 50 + Math.random() * 30; // Smaller cars for mobile
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
  
  return { type: 'road', y, cars, coins: [], logs: [], powerUps: [], speed, direction };
};

const generateInitialLanes = (): Lane[] => {
  const lanes: Lane[] = [];
  
  // Start with grass
  lanes.push(createLane(0, 'grass'));
  
  // Generate varied patterns
  for (let i = 1; i < 50; i++) {
    const rand = Math.random();
    // 50% road, 30% grass, 20% water
    let type: 'grass' | 'road' | 'water';
    if (rand < 0.5) {
      type = 'road';
    } else if (rand < 0.8) {
      type = 'grass';
    } else {
      type = 'water';
    }
    lanes.push(createLane(i, type));
  }
  
  return lanes;
};

const loadSkins = (): UnlockableSkin[] => {
  const saved = localStorage.getItem('crossySkins');
  if (saved) {
    return JSON.parse(saved);
  }
  return DEFAULT_SKINS;
};

const loadSelectedSkin = (): SkinType => {
  const saved = localStorage.getItem('crossySelectedSkin');
  return (saved as SkinType) || 'chicken';
};

export const useGameLogic = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: GAME_WIDTH / 2, y: 0 });
  const [lanes, setLanes] = useState<Lane[]>(generateInitialLanes);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [totalCoinsEver, setTotalCoinsEver] = useState(() => {
    const saved = localStorage.getItem('crossyTotalCoins');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('crossyHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [maxY, setMaxY] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isHopping, setIsHopping] = useState(false);
  const [deathCause, setDeathCause] = useState<'car' | 'water' | null>(null);
  const [skins, setSkins] = useState<UnlockableSkin[]>(loadSkins);
  const [selectedSkin, setSelectedSkin] = useState<SkinType>(loadSelectedSkin);
  const [isOnLog, setIsOnLog] = useState(false);
  const [currentLogSpeed, setCurrentLogSpeed] = useState<{ speed: number; direction: 1 | -1 } | null>(null);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Save skins when they change
  useEffect(() => {
    localStorage.setItem('crossySkins', JSON.stringify(skins));
  }, [skins]);

  // Save selected skin
  useEffect(() => {
    localStorage.setItem('crossySelectedSkin', selectedSkin);
  }, [selectedSkin]);

  // Check and unlock skins
  const checkSkinUnlocks = useCallback((currentScore: number, currentTotalCoins: number) => {
    setSkins(prevSkins => {
      let changed = false;
      const newSkins = prevSkins.map(skin => {
        if (skin.unlocked) return skin;
        
        if (skin.requirement.type === 'coins' && currentTotalCoins >= skin.requirement.value) {
          changed = true;
          return { ...skin, unlocked: true };
        }
        if (skin.requirement.type === 'score' && currentScore >= skin.requirement.value) {
          changed = true;
          return { ...skin, unlocked: true };
        }
        return skin;
      });
      
      return changed ? newSkins : prevSkins;
    });
  }, []);

  const selectSkin = useCallback((skinId: SkinType) => {
    const skin = skins.find(s => s.id === skinId);
    if (skin?.unlocked) {
      setSelectedSkin(skinId);
    }
  }, [skins]);

  // Check if a power-up is active
  const hasPowerUp = useCallback((type: PowerUpType): boolean => {
    return activePowerUps.some(p => p.type === type && p.endTime > Date.now());
  }, [activePowerUps]);

  // Activate a power-up
  const activatePowerUp = useCallback((type: PowerUpType) => {
    const endTime = Date.now() + POWER_UP_DURATION;
    setActivePowerUps(prev => {
      // Remove existing of same type and add new
      const filtered = prev.filter(p => p.type !== type);
      return [...filtered, { type, endTime }];
    });
  }, []);

  // Clean up expired power-ups
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePowerUps(prev => prev.filter(p => p.endTime > Date.now()));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const checkPowerUpCollection = useCallback((px: number, py: number) => {
    setLanes((prevLanes) => {
      const lane = prevLanes[py];
      if (!lane || lane.type !== 'grass') return prevLanes;

      let collected = false;
      let collectedType: PowerUpType | null = null;
      const updatedPowerUps = lane.powerUps.map((powerUp) => {
        if (powerUp.collected) return powerUp;
        
        const puLeft = powerUp.x - POWER_UP_SIZE / 2;
        const puRight = powerUp.x + POWER_UP_SIZE / 2;
        const playerLeft = px - PLAYER_SIZE / 2;
        const playerRight = px + PLAYER_SIZE / 2;
        
        if (playerLeft < puRight && playerRight > puLeft) {
          collected = true;
          collectedType = powerUp.type;
          return { ...powerUp, collected: true };
        }
        return powerUp;
      });

      if (collected && collectedType) {
        activatePowerUp(collectedType);
        return prevLanes.map((l, idx) => 
          idx === py ? { ...l, powerUps: updatedPowerUps } : l
        );
      }
      return prevLanes;
    });
  }, [activatePowerUp]);

  const checkCoinCollection = useCallback((px: number, py: number, magnetActive: boolean) => {
    setLanes((prevLanes) => {
      let totalCollected = 0;
      
      const newLanes = prevLanes.map((lane, idx) => {
        if (lane.type !== 'grass') return lane;
        
        // Check coins in current lane and nearby lanes if magnet is active
        const isInRange = magnetActive 
          ? Math.abs(idx - py) <= 2 
          : idx === py;
        
        if (!isInRange) return lane;

        let laneCollected = false;
        const updatedCoins = lane.coins.map((coin) => {
          if (coin.collected) return coin;
          
          const coinLeft = coin.x - COIN_SIZE / 2;
          const coinRight = coin.x + COIN_SIZE / 2;
          const playerLeft = px - (magnetActive ? MAGNET_RANGE : PLAYER_SIZE / 2);
          const playerRight = px + (magnetActive ? MAGNET_RANGE : PLAYER_SIZE / 2);
          
          if (playerLeft < coinRight && playerRight > coinLeft) {
            laneCollected = true;
            totalCollected++;
            return { ...coin, collected: true };
          }
          return coin;
        });

        if (laneCollected) {
          return { ...lane, coins: updatedCoins };
        }
        return lane;
      });

      if (totalCollected > 0) {
        setCoinsCollected((c) => c + totalCollected);
        setTotalCoinsEver((prev) => {
          const newTotal = prev + totalCollected;
          localStorage.setItem('crossyTotalCoins', newTotal.toString());
          return newTotal;
        });
        setScore((s) => s + 5 * totalCollected);
        return newLanes;
      }
      return prevLanes;
    });
  }, []);

  const checkCarCollision = useCallback((px: number, py: number, currentLanes: Lane[]): boolean => {
    const lane = currentLanes[py];
    // Only check collision if player is actually on a road lane
    if (!lane || lane.type !== 'road') return false;

    // Use generous hitbox margins to prevent false positives
    const hitboxMargin = 12;
    const playerLeft = px - PLAYER_SIZE / 2 + hitboxMargin;
    const playerRight = px + PLAYER_SIZE / 2 - hitboxMargin;

    for (const car of lane.cars) {
      const carLeft = car.x + 5;
      const carRight = car.x + car.width - 5;

      // Simple X-axis overlap check - player is on the same lane as car
      if (playerLeft < carRight && playerRight > carLeft) {
        return true;
      }
    }
    return false;
  }, []);

  const checkWaterSafety = useCallback((px: number, py: number, currentLanes: Lane[]): { safe: boolean; log?: Log } => {
    const lane = currentLanes[py];
    // Only check water safety if player is actually on a water lane
    if (!lane || lane.type !== 'water') return { safe: true };

    // Use smaller margins to make it easier to land on logs
    const hitboxMargin = 5;
    const playerCenter = px;

    for (const log of lane.logs) {
      const logLeft = log.x + hitboxMargin;
      const logRight = log.x + log.width - hitboxMargin;

      // Check if player center is on the log (more forgiving)
      if (playerCenter >= logLeft && playerCenter <= logRight) {
        return { safe: true, log };
      }
    }
    return { safe: false };
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
            const rand = Math.random();
            let type: 'grass' | 'road' | 'water';
            if (rand < 0.5) type = 'road';
            else if (rand < 0.8) type = 'grass';
            else type = 'water';
            newLanes.push(createLane(laneY, type));
          }
          return newLanes;
        });
      }

      // Update score
      if (newY > maxY) {
        setMaxY(newY);
        setScore((s) => s + 1);
      }

      // Check for coin and power-up collection after move
      setTimeout(() => {
        const magnetActive = activePowerUps.some(p => p.type === 'magnet' && p.endTime > Date.now());
        checkCoinCollection(newX, newY, magnetActive);
        checkPowerUpCollection(newX, newY);
      }, 0);

      return { x: newX, y: newY };
    });
  }, [isGameOver, isHopping, lanes.length, maxY, checkCoinCollection, checkPowerUpCollection, activePowerUps]);

  const resetGame = useCallback(() => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: 0 });
    setLanes(generateInitialLanes());
    setScore(0);
    setCoinsCollected(0);
    setMaxY(0);
    setIsGameOver(false);
    setIsHopping(false);
    setDeathCause(null);
    setIsOnLog(false);
    setCurrentLogSpeed(null);
    setActivePowerUps([]);
  }, []);

  // Game loop for moving cars, logs, and player on logs
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      
      if (delta > 16) { // ~60fps
        lastTimeRef.current = timestamp;
        
        // Check for slow-mo power-up
        const slowMoActive = activePowerUps.some(p => p.type === 'slowmo' && p.endTime > Date.now());
        const speedMultiplier = slowMoActive ? 0.4 : 1;
        
        setLanes((prevLanes) => {
          const newLanes = prevLanes.map((lane) => {
            if (lane.type === 'road') {
              const updatedCars = lane.cars.map((car) => {
                let newX = car.x + car.speed * car.direction * speedMultiplier;
                
                // Wrap around
                if (car.direction === 1 && newX > GAME_WIDTH + car.width) {
                  newX = -car.width;
                } else if (car.direction === -1 && newX < -car.width) {
                  newX = GAME_WIDTH + car.width;
                }
                
                return { ...car, x: newX };
              });
              
              return { ...lane, cars: updatedCars };
            }
            
            if (lane.type === 'water') {
              const updatedLogs = lane.logs.map((log) => {
                let newX = log.x + log.speed * log.direction * speedMultiplier;
                
                // Wrap around
                if (log.direction === 1 && newX > GAME_WIDTH + log.width) {
                  newX = -log.width;
                } else if (log.direction === -1 && newX < -log.width) {
                  newX = GAME_WIDTH + log.width;
                }
                
                return { ...log, x: newX };
              });
              
              return { ...lane, logs: updatedLogs };
            }
            
            return lane;
          });
          
          // Check car collision (skip if invincible)
          const isInvincible = activePowerUps.some(p => p.type === 'invincibility' && p.endTime > Date.now());
          if (!isGameOver && !isInvincible && checkCarCollision(playerPos.x, playerPos.y, newLanes)) {
            setIsGameOver(true);
            setDeathCause('car');
            const finalScore = score;
            if (finalScore > highScore) {
              setHighScore(finalScore);
              localStorage.setItem('crossyHighScore', finalScore.toString());
            }
            checkSkinUnlocks(finalScore, totalCoinsEver);
          }
          
          // Check water safety (skip if invincible)
          if (!isGameOver) {
            const waterCheck = checkWaterSafety(playerPos.x, playerPos.y, newLanes);
            const currentLane = newLanes[playerPos.y];
            
            if (currentLane?.type === 'water') {
              if (!waterCheck.safe && !isInvincible) {
                setIsGameOver(true);
                setDeathCause('water');
                const finalScore = score;
                if (finalScore > highScore) {
                  setHighScore(finalScore);
                  localStorage.setItem('crossyHighScore', finalScore.toString());
                }
                checkSkinUnlocks(finalScore, totalCoinsEver);
              } else if (waterCheck.log) {
                setIsOnLog(true);
                setCurrentLogSpeed({ speed: waterCheck.log.speed * speedMultiplier, direction: waterCheck.log.direction });
              } else if (isInvincible) {
                // When invincible in water without log, don't die but also don't move with logs
                setIsOnLog(false);
                setCurrentLogSpeed(null);
              }
            } else {
              setIsOnLog(false);
              setCurrentLogSpeed(null);
            }
          }
          
          return newLanes;
        });
        
        // Move player with log
        if (isOnLog && currentLogSpeed && !isGameOver) {
          setPlayerPos(prev => {
            let newX = prev.x + currentLogSpeed.speed * currentLogSpeed.direction;
            
            // Check boundaries
            if (newX < PLAYER_SIZE / 2 || newX > GAME_WIDTH - PLAYER_SIZE / 2) {
              setIsGameOver(true);
              setDeathCause('water');
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('crossyHighScore', score.toString());
              }
              return prev;
            }
            
            return { ...prev, x: newX };
          });
        }
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [playerPos, isGameOver, checkCarCollision, checkWaterSafety, score, highScore, isOnLog, currentLogSpeed, checkSkinUnlocks, totalCoinsEver, activePowerUps]);

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
    totalCoinsEver,
    highScore,
    isGameOver,
    isHopping,
    deathCause,
    skins,
    selectedSkin,
    selectSkin,
    movePlayer,
    resetGame,
    activePowerUps,
    hasPowerUp,
    GRID_SIZE,
    GAME_WIDTH,
    VISIBLE_LANES,
    PLAYER_SIZE,
    CAR_HEIGHT,
    LOG_HEIGHT,
  };
};
