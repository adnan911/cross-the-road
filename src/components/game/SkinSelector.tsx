import { motion } from 'framer-motion';
import { Lock, Check, Coins, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { UnlockableSkin, SkinType } from '@/hooks/useGameLogic';
import { useState } from 'react';

interface SkinSelectorProps {
  skins: UnlockableSkin[];
  selectedSkin: SkinType;
  onSelectSkin: (skinId: SkinType) => void;
  totalCoins: number;
  highScore: number;
}

const SkinSelector = ({ skins, selectedSkin, onSelectSkin, totalCoins, highScore }: SkinSelectorProps) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCount = 5;
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex < skins.length - visibleCount;

  const scrollLeft = () => {
    if (canScrollLeft) setScrollIndex(scrollIndex - 1);
  };

  const scrollRight = () => {
    if (canScrollRight) setScrollIndex(scrollIndex + 1);
  };

  const visibleSkins = skins.slice(scrollIndex, scrollIndex + visibleCount);

  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border shadow-lg w-full max-w-[400px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-arcade text-[10px] text-primary">CHARACTERS</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Coins className="w-3 h-3 text-game-road-marking" />
            <span className="font-arcade text-[8px] text-game-road-marking">{totalCoins}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-secondary" />
            <span className="font-arcade text-[8px] text-secondary">{highScore}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`p-1 rounded-lg transition-all ${canScrollLeft ? 'hover:bg-muted text-foreground' : 'text-muted cursor-not-allowed'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5 justify-center flex-1 overflow-hidden">
          {visibleSkins.map((skin) => {
            const isSelected = selectedSkin === skin.id;
            const progress = skin.requirement.type === 'coins' 
              ? Math.min(100, (totalCoins / skin.requirement.value) * 100)
              : Math.min(100, (highScore / skin.requirement.value) * 100);
            
            return (
              <motion.button
                key={skin.id}
                onClick={() => skin.unlocked && onSelectSkin(skin.id)}
                className={`relative p-1.5 rounded-lg border-2 transition-all min-w-[52px] ${
                  isSelected 
                    ? 'border-primary bg-primary/20 shadow-md' 
                    : skin.unlocked 
                      ? 'border-border hover:border-primary/50 bg-card' 
                      : 'border-muted bg-muted/30 cursor-not-allowed'
                }`}
                whileHover={skin.unlocked ? { scale: 1.05 } : {}}
                whileTap={skin.unlocked ? { scale: 0.95 } : {}}
                layout
              >
                {/* Skin preview */}
                <div 
                  className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center shadow-inner ${!skin.unlocked ? 'opacity-40 grayscale' : ''}`}
                  style={{ background: skin.color }}
                >
                  {!skin.unlocked && (
                    <Lock className="w-3 h-3 text-foreground/70" />
                  )}
                </div>
                
                {/* Selected indicator */}
                {isSelected && skin.unlocked && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </motion.div>
                )}
                
                {/* Name */}
                <p className={`text-[7px] font-arcade mt-1 text-center truncate ${skin.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {skin.name}
                </p>
                
                {/* Requirement progress */}
                {!skin.unlocked && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${progress}%`,
                          background: skin.requirement.type === 'coins' 
                            ? 'hsl(var(--road-marking))' 
                            : 'hsl(var(--secondary))',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-0.5 mt-0.5">
                      {skin.requirement.type === 'coins' ? (
                        <Coins className="w-2 h-2 text-game-road-marking" />
                      ) : (
                        <Trophy className="w-2 h-2 text-secondary" />
                      )}
                      <span className="text-[6px] text-muted-foreground">
                        {skin.requirement.value}
                      </span>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`p-1 rounded-lg transition-all ${canScrollRight ? 'hover:bg-muted text-foreground' : 'text-muted cursor-not-allowed'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-1 mt-2">
        {Array.from({ length: Math.ceil(skins.length / visibleCount) }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              Math.floor(scrollIndex / visibleCount) === i ? 'bg-primary w-3' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SkinSelector;
