import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import Player from './Player';
import Lane from './Lane';
import GameOverlay from './GameOverlay';
import ScoreDisplay from './ScoreDisplay';
import MobileControls from './MobileControls';
import SkinSelector from './SkinSelector';
import ReportCard from './ReportCard';
import PowerUpDisplay from './PowerUpDisplay';
import WeatherEffects from './WeatherEffects';
import DeathEffect from './DeathEffect';

const GameBoard = () => {
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
  } = useGameLogic();

  const { timeOfDay, weather, screenShake, triggerShake, getShakeTransform } = useVisualEffects(score);

  const [showReport, setShowReport] = useState(false);
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  const [shakeFrame, setShakeFrame] = useState(0);

  // Calculate visible lanes based on player position
  const cameraY = playerPos.y - 3;
  const visibleStart = Math.max(0, Math.floor(cameraY));
  const visibleEnd = visibleStart + VISIBLE_LANES + 2;
  const visibleLanes = lanes.slice(visibleStart, visibleEnd);

  // Trigger effects on death
  useEffect(() => {
    if (isGameOver && deathCause) {
      setShowDeathEffect(true);
      triggerShake(deathCause === 'car' ? 12 : 6);
    } else {
      setShowDeathEffect(false);
    }
  }, [isGameOver, deathCause, triggerShake]);

  // Animate screen shake
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

  const handleRestart = useCallback(() => {
    setShowDeathEffect(false);
    resetGame();
  }, [resetGame]);

  // Check if player has invincibility for visual effect
  const isInvincible = hasPowerUp('invincibility');

  // Memoize shake transform
  const shakeTransform = useMemo(() => {
    if (!screenShake) return '';
    return getShakeTransform();
  }, [screenShake, shakeFrame, getShakeTransform]);

  return (
    <div className="flex flex-col items-center gap-2 w-full px-2">
      <ScoreDisplay score={score} highScore={highScore} coinsCollected={coinsCollected} />
      
      {/* Active Power-ups */}
      <PowerUpDisplay activePowerUps={activePowerUps} />
      
      <motion.div 
        className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-muted"
        style={{ 
          width: GAME_WIDTH, 
          height: VISIBLE_LANES * GRID_SIZE,
          maxWidth: '100%',
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
          style={{ 
            background: timeOfDay.overlayColor,
          }}
        />

        {/* Weather effects */}
        <WeatherEffects 
          weather={weather} 
          width={GAME_WIDTH} 
          height={VISIBLE_LANES * GRID_SIZE} 
        />

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
          
          {/* Death Effect */}
          {showDeathEffect && deathCause && (
            <DeathEffect
              type={deathCause}
              x={playerPos.x}
              y={playerPos.y}
              gridSize={GRID_SIZE}
              playerSize={PLAYER_SIZE}
            />
          )}
          
          {/* Player */}
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
        
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] z-20" />
        
        {/* Time of day indicator */}
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
        
        {/* Game Over Overlay */}
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
      
      <MobileControls onMove={movePlayer} disabled={isGameOver} />
      
      {/* Skin Selector - Always visible */}
      <SkinSelector 
        skins={skins}
        selectedSkin={selectedSkin}
        onSelectSkin={selectSkin}
        totalCoins={totalCoinsEver}
        highScore={highScore}
      />
      
      <p className="text-muted-foreground text-xs text-center hidden md:block">
        Use <span className="font-arcade text-[10px] text-primary">WASD</span> or{' '}
        <span className="font-arcade text-[10px] text-primary">Arrow Keys</span> to move
      </p>

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
