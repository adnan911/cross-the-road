import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import Player from './Player';
import Lane from './Lane';
import GameOverlay from './GameOverlay';
import MobileControls from './MobileControls';
import ReportCard from './ReportCard';
// PowerUpDisplay removed (moved to UtilityPanel)
// ScoreDisplay removed (moved to StatsRow)
import WeatherEffects from './WeatherEffects';
import DeathEffect from './DeathEffect';
import ComboDisplay from './ComboDisplay';

interface GameBoardProps {
  gameLogic: any; // Type strictly if possible, or use return type of useGameLogic
}

const GameBoard = ({ gameLogic }: GameBoardProps) => {
  const {
    playerPos,
    lanes,
    score,
    coinsCollected,
    totalCoinsEver,
    highScore,
    isGameOver,
    isHopping,
    deathCause,
    selectedSkin,
    movePlayer,
    resetGame,
    activePowerUps,
    hasPowerUp,
    combo,
    comboMultiplier,
    GRID_SIZE,
    GAME_WIDTH,
    VISIBLE_LANES,
    PLAYER_SIZE,
  } = gameLogic;

  // Visual effects can remain here or move up. Keeping here for now as they are tied to canvas rendering.
  const { timeOfDay, weather, screenShake, triggerShake, getShakeTransform } = useVisualEffects(score);

  const [showReport, setShowReport] = useState(false);
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  const [shakeFrame, setShakeFrame] = useState(0);

  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    handleGestureEnd(touchStartRef.current, touchEnd);
    touchStartRef.current = null;
  };

  // Mouse handling for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartRef.current) return;

    const mouseEnd = {
      x: e.clientX,
      y: e.clientY
    };

    handleGestureEnd(touchStartRef.current, mouseEnd);
    touchStartRef.current = null;
  };

  const handleGestureEnd = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    const SWIPE_THRESHOLD = 30;

    if (Math.max(absDx, absDy) > SWIPE_THRESHOLD) {
      if (absDx > absDy) {
        movePlayer(dx > 0 ? 'right' : 'left');
      } else {
        movePlayer(dy > 0 ? 'down' : 'up');
      }
    } else {
      // Tap detected
      movePlayer('up');
    }
  };

  // Calculate visible lanes
  const cameraY = playerPos.y + 2;
  const visibleStart = Math.max(0, Math.floor(cameraY - VISIBLE_LANES / 2 - 2));
  const visibleEnd = visibleStart + VISIBLE_LANES + 4;
  const visibleLanes = lanes.slice(visibleStart, visibleEnd);

  const currentLane = lanes[playerPos.y];
  const nextLane = lanes[playerPos.y + 1];
  const isBossAhead = nextLane?.isBossLane;

  useEffect(() => {
    if (isGameOver && deathCause) {
      setShowDeathEffect(true);
      triggerShake(deathCause === 'car' ? 12 : 6);
    } else {
      setShowDeathEffect(false);
    }
  }, [isGameOver, deathCause, triggerShake]);

  useEffect(() => {
    if (!screenShake) return;
    const interval = setInterval(() => {
      setShakeFrame(f => f + 1);
    }, 16);
    return () => clearInterval(interval);
  }, [screenShake]);

  const handleShowReport = () => {
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  const handleRestart = () => {
    setShowDeathEffect(false);
    resetGame();
  };

  const isInvincible = hasPowerUp('invincibility');

  const shakeTransform = useMemo(() => {
    if (!screenShake) return '';
    return getShakeTransform();
  }, [screenShake, shakeFrame, getShakeTransform]);

  const gameHeight = VISIBLE_LANES * GRID_SIZE + 100;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Removed ScoreDisplay & PowerUpDisplay */}

      <motion.div
        className="relative overflow-hidden w-full h-full touch-none cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          transform: shakeTransform,
        }}
        animate={screenShake ? {
          x: [0, -4, 4, -3, 3, -2, 2, 0],
          y: [0, 2, -2, 1, -1, 0],
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Day/Night overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20 transition-all duration-1000"
          style={{ background: timeOfDay.overlayColor }}
        />

        {/* Weather effects */}
        <WeatherEffects weather={weather} width={GAME_WIDTH} height={gameHeight} />

        <ComboDisplay combo={combo} multiplier={comboMultiplier} />

        {/* Boss warning */}
        {isBossAhead && !isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-lg bg-destructive/90 backdrop-blur-sm shadow-lg"
          >
            <span className="font-arcade text-[10px] text-destructive-foreground animate-pulse">
              ⚠️ BOSS LANE AHEAD ⚠️
            </span>
          </motion.div>
        )}

        {/* Game World Camera Container */}
        <div
          className="absolute w-full left-1/2 -translate-x-1/2"
          style={{
            width: GAME_WIDTH, // Constrain width of the actual game lanes
            height: lanes.length * GRID_SIZE,
            bottom: 60, // Shift up slightly
            transform: `translate(-50%, ${cameraY * GRID_SIZE - (VISIBLE_LANES * GRID_SIZE) / 2 + GRID_SIZE}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {visibleLanes.map((lane: any) => (
            <div
              key={lane.y}
              className="absolute w-full"
              style={{ bottom: lane.y * GRID_SIZE, height: GRID_SIZE }}
            >
              <Lane lane={lane} gridSize={GRID_SIZE} gameWidth={GAME_WIDTH} />
            </div>
          ))}

          {showDeathEffect && deathCause && (
            <DeathEffect
              type={deathCause}
              x={playerPos.x}
              y={playerPos.y}
              gridSize={GRID_SIZE}
              playerSize={PLAYER_SIZE}
            />
          )}

          <div
            className={`absolute z-20 ${isInvincible ? 'animate-pulse' : ''}`}
            style={{
              left: playerPos.x - PLAYER_SIZE / 2,
              bottom: playerPos.y * GRID_SIZE + (GRID_SIZE - PLAYER_SIZE) / 2,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              transition: 'left 0.1s ease-out, bottom 0.1s ease-out',
              filter: isInvincible ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none',
              opacity: showDeathEffect ? 0 : 1,
            }}
          >
            <Player isHopping={isHopping} skin={selectedSkin} />
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] z-20" />

        {/* Indicators */}
        <div className="absolute top-2 right-2 z-20 text-xs font-arcade px-2 py-1 rounded bg-background/50 backdrop-blur-sm">
          {timeOfDay.name === 'dawn' && '🌅'}
          {timeOfDay.name === 'day' && '☀️'}
          {timeOfDay.name === 'dusk' && '🌆'}
          {timeOfDay.name === 'night' && '🌙'}
          {weather !== 'clear' && (
            <span className="ml-1">
              {weather === 'rain' && '🌧️'}
              {weather === 'snow' && '❄️'}
              {weather === 'fog' && '🌫️'}
            </span>
          )}
        </div>

        {currentLane?.isReverse && !isGameOver && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-2 py-1 rounded bg-secondary/80 backdrop-blur-sm">
            <span className="font-arcade text-[8px] text-secondary-foreground">
              ↔️ REVERSE
            </span>
          </div>
        )}

        {!isGameOver && (
          <MobileControls onMove={movePlayer} disabled={isGameOver} />
        )}

        {isGameOver && (
          <GameOverlay
            score={score}
            highScore={highScore}
            coinsCollected={coinsCollected}
            deathCause={deathCause}
            onRestart={handleRestart}
            onShowReport={handleShowReport}
          />
        )}
      </motion.div>

      {/* Report Card Modal */}
      {showReport && (
        <ReportCard
          score={score}
          highScore={highScore}
          coinsCollected={coinsCollected}
          totalCoinsEver={totalCoinsEver}
          deathCause={deathCause}
          onClose={handleCloseReport}
        />
      )}
    </div>
  );
};

export default GameBoard;
