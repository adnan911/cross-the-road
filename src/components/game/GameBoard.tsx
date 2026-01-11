import { useState } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import Player from './Player';
import Lane from './Lane';
import GameOverlay from './GameOverlay';
import ScoreDisplay from './ScoreDisplay';
import MobileControls from './MobileControls';
import SkinSelector from './SkinSelector';
import ReportCard from './ReportCard';
import PowerUpDisplay from './PowerUpDisplay';

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

  const [showReport, setShowReport] = useState(false);

  // Calculate visible lanes based on player position
  const cameraY = playerPos.y - 3;
  const visibleStart = Math.max(0, Math.floor(cameraY));
  const visibleEnd = visibleStart + VISIBLE_LANES + 2;
  const visibleLanes = lanes.slice(visibleStart, visibleEnd);

  const handleShowReport = () => {
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  // Check if player has invincibility for visual effect
  const isInvincible = hasPowerUp('invincibility');

  return (
    <div className="flex flex-col items-center gap-2 w-full px-2">
      <ScoreDisplay score={score} highScore={highScore} coinsCollected={coinsCollected} />
      
      {/* Active Power-ups */}
      <PowerUpDisplay activePowerUps={activePowerUps} />
      
      <div 
        className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-muted"
        style={{ 
          width: GAME_WIDTH, 
          height: VISIBLE_LANES * GRID_SIZE,
          maxWidth: '100%',
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
            className={`absolute z-20 ${isInvincible ? 'animate-pulse' : ''}`}
            style={{
              left: playerPos.x - PLAYER_SIZE / 2,
              bottom: playerPos.y * GRID_SIZE + (GRID_SIZE - PLAYER_SIZE) / 2,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              transition: 'left 0.1s ease-out, bottom 0.1s ease-out',
              filter: isInvincible ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none',
            }}
          >
            <Player isHopping={isHopping} skin={selectedSkin} />
          </div>
        </div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" />
        
        {/* Game Over Overlay */}
        {isGameOver && (
          <GameOverlay 
            score={score} 
            highScore={highScore} 
            coinsCollected={coinsCollected}
            deathCause={deathCause}
            onRestart={resetGame}
            onShowReport={handleShowReport}
          />
        )}
      </div>
      
      <MobileControls onMove={movePlayer} disabled={isGameOver} />
      
      {/* Skin Selector - Hidden on very small screens during gameplay */}
      <div className="hidden sm:block">
        <SkinSelector 
          skins={skins}
          selectedSkin={selectedSkin}
          onSelectSkin={selectSkin}
          totalCoins={totalCoinsEver}
          highScore={highScore}
        />
      </div>
      
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
