import { motion } from 'framer-motion';
import { useGameLogic } from '@/hooks/useGameLogic';
import Player from './Player';
import Lane from './Lane';
import GameOverlay from './GameOverlay';
import ScoreDisplay from './ScoreDisplay';
import MobileControls from './MobileControls';

const GameBoard = () => {
  const {
    playerPos,
    lanes,
    score,
    highScore,
    isGameOver,
    isHopping,
    movePlayer,
    resetGame,
    GRID_SIZE,
    GAME_WIDTH,
    VISIBLE_LANES,
    PLAYER_SIZE,
  } = useGameLogic();

  // Calculate visible lanes based on player position
  const cameraY = playerPos.y - 3;
  const visibleStart = Math.max(0, Math.floor(cameraY));
  const visibleEnd = visibleStart + VISIBLE_LANES + 2;
  const visibleLanes = lanes.slice(visibleStart, visibleEnd);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <ScoreDisplay score={score} highScore={highScore} />
      
      <div 
        className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-muted"
        style={{ 
          width: GAME_WIDTH, 
          height: VISIBLE_LANES * GRID_SIZE,
          maxWidth: '100vw',
        }}
      >
        {/* Game world container that moves with camera */}
        <div
          className="absolute w-full"
          style={{ 
            height: lanes.length * GRID_SIZE,
            bottom: 0,
            transform: `translateY(${cameraY * GRID_SIZE - (VISIBLE_LANES * GRID_SIZE) / 2 + GRID_SIZE}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Render visible lanes */}
          {visibleLanes.map((lane) => (
            <div
              key={lane.y}
              className="absolute w-full"
              style={{ 
                bottom: lane.y * GRID_SIZE,
                height: GRID_SIZE,
              }}
            >
              <Lane lane={lane} gridSize={GRID_SIZE} gameWidth={GAME_WIDTH} />
            </div>
          ))}
          
          {/* Player */}
          <div
            className="absolute z-20"
            style={{
              left: playerPos.x - PLAYER_SIZE / 2,
              bottom: playerPos.y * GRID_SIZE + (GRID_SIZE - PLAYER_SIZE) / 2,
              transition: 'left 0.1s ease-out, bottom 0.1s ease-out',
            }}
          >
            <Player isHopping={isHopping} />
          </div>
        </div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]" />
        
        {/* Game Over Overlay */}
        {isGameOver && (
          <GameOverlay score={score} highScore={highScore} onRestart={resetGame} />
        )}
      </div>
      
      <MobileControls onMove={movePlayer} disabled={isGameOver} />
      
      <p className="text-muted-foreground text-sm text-center">
        Use <span className="font-arcade text-xs text-primary">WASD</span> or{' '}
        <span className="font-arcade text-xs text-primary">Arrow Keys</span> to move
      </p>
    </div>
  );
};

export default GameBoard;
