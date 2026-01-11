import { motion } from 'framer-motion';
import { Lock, Check, Coins, Trophy } from 'lucide-react';
import { UnlockableSkin, SkinType } from '@/hooks/useGameLogic';

interface SkinSelectorProps {
  skins: UnlockableSkin[];
  selectedSkin: SkinType;
  onSelectSkin: (skinId: SkinType) => void;
  totalCoins: number;
  highScore: number;
}

const SkinSelector = ({ skins, selectedSkin, onSelectSkin, totalCoins, highScore }: SkinSelectorProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-lg">
      <h3 className="font-arcade text-xs text-primary mb-3 text-center">SELECT CHARACTER</h3>
      
      <div className="flex gap-2 justify-center flex-wrap">
        {skins.map((skin) => {
          const isSelected = selectedSkin === skin.id;
          const progress = skin.requirement.type === 'coins' 
            ? Math.min(100, (totalCoins / skin.requirement.value) * 100)
            : Math.min(100, (highScore / skin.requirement.value) * 100);
          
          return (
            <motion.button
              key={skin.id}
              onClick={() => skin.unlocked && onSelectSkin(skin.id)}
              className={`relative p-2 rounded-lg border-2 transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/20' 
                  : skin.unlocked 
                    ? 'border-border hover:border-primary/50 bg-card' 
                    : 'border-muted bg-muted/30 cursor-not-allowed'
              }`}
              whileHover={skin.unlocked ? { scale: 1.05 } : {}}
              whileTap={skin.unlocked ? { scale: 0.95 } : {}}
            >
              {/* Skin preview */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${!skin.unlocked ? 'opacity-50' : ''}`}
                style={{ background: skin.color }}
              >
                {!skin.unlocked && (
                  <Lock className="w-4 h-4 text-foreground/70" />
                )}
              </div>
              
              {/* Selected indicator */}
              {isSelected && skin.unlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {/* Name */}
              <p className={`text-[8px] font-arcade mt-1 text-center ${skin.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {skin.name}
              </p>
              
              {/* Requirement */}
              {!skin.unlocked && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/60 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
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
    </div>
  );
};

export default SkinSelector;
