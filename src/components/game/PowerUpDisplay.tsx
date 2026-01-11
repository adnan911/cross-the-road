import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Magnet, Clock } from 'lucide-react';
import { ActivePowerUp, PowerUpType } from '@/hooks/useGameLogic';

interface PowerUpDisplayProps {
  activePowerUps: ActivePowerUp[];
}

const PowerUpDisplay = ({ activePowerUps }: PowerUpDisplayProps) => {
  const getIcon = (type: PowerUpType) => {
    switch (type) {
      case 'invincibility':
        return <Shield className="w-4 h-4" />;
      case 'magnet':
        return <Magnet className="w-4 h-4" />;
      case 'slowmo':
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLabel = (type: PowerUpType) => {
    switch (type) {
      case 'invincibility':
        return 'SHIELD';
      case 'magnet':
        return 'MAGNET';
      case 'slowmo':
        return 'SLOW-MO';
    }
  };

  const getColor = (type: PowerUpType) => {
    switch (type) {
      case 'invincibility':
        return 'from-blue-500 to-cyan-400';
      case 'magnet':
        return 'from-pink-500 to-rose-400';
      case 'slowmo':
        return 'from-purple-500 to-violet-400';
    }
  };

  const now = Date.now();
  const activeItems = activePowerUps.filter(p => p.endTime > now);

  if (activeItems.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      <AnimatePresence>
        {activeItems.map((powerUp) => {
          const remaining = Math.max(0, Math.ceil((powerUp.endTime - now) / 1000));
          return (
            <motion.div
              key={powerUp.type}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r ${getColor(powerUp.type)} text-white text-xs font-bold shadow-lg`}
            >
              {getIcon(powerUp.type)}
              <span className="font-arcade text-[8px]">{getLabel(powerUp.type)}</span>
              <span className="font-arcade text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">
                {remaining}s
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default PowerUpDisplay;
