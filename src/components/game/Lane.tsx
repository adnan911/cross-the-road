import { memo } from 'react';
import { Lane as LaneType } from '@/hooks/useGameLogic';
import Car from './Car';
import Coin from './Coin';
import Log from './Log';
import PowerUp from './PowerUp';

interface LaneProps {
  lane: LaneType;
  gridSize: number;
  gameWidth: number;
}

const Lane = memo(({ lane, gridSize, gameWidth }: LaneProps) => {
  const isGrass = lane.type === 'grass';
  const isWater = lane.type === 'water';
  const isAlternate = lane.y % 2 === 0;
  
  return (
    <div
      className={`absolute w-full ${
        isGrass 
          ? isAlternate 
            ? 'bg-game-grass' 
            : 'bg-game-grass-light'
          : isWater
            ? 'bg-game-water'
            : 'bg-game-road'
      }`}
      style={{
        height: gridSize,
        left: 0,
        right: 0,
      }}
    >
      {/* Road markings */}
      {!isGrass && !isWater && (
        <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-1 bg-game-road-marking/60 rounded-full"
            />
          ))}
        </div>
      )}
      
      {/* Grass details */}
      {isGrass && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 bg-primary/40 rounded-full"
              style={{
                left: `${15 + i * 25}%`,
                top: '25%',
                transform: `rotate(${-10 + Math.random() * 20}deg)`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Water effects */}
      {isWater && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-8 h-1 rounded-full animate-pulse"
                style={{
                  left: `${i * 25}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Logs */}
      {lane.logs.map((log) => (
        <Log key={log.id} log={log} gridSize={gridSize} />
      ))}
      
      {/* Power-ups */}
      {lane.powerUps.map((powerUp) => (
        <div
          key={powerUp.id}
          className="absolute"
          style={{
            left: powerUp.x - 16,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <PowerUp type={powerUp.type} collected={powerUp.collected} />
        </div>
      ))}
      
      {/* Coins */}
      {lane.coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute"
          style={{
            left: coin.x - 12,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <Coin collected={coin.collected} />
        </div>
      ))}
      
      {/* Cars */}
      {lane.cars.map((car) => (
        <Car key={car.id} car={car} />
      ))}
    </div>
  );
});

Lane.displayName = 'Lane';

export default Lane;
