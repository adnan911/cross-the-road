import { motion } from 'framer-motion';
import { memo } from 'react';

interface CoinProps {
  collected: boolean;
}

const Coin = memo(({ collected }: CoinProps) => {
  if (collected) return null;
  
  return (
    <motion.div
      className="absolute z-10"
      style={{ width: 24, height: 24 }}
      animate={{ 
        rotateY: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        rotateY: { duration: 2, repeat: Infinity, ease: 'linear' },
        scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg border-2 border-yellow-500 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-yellow-200/60" />
      </div>
      {/* Sparkle effect */}
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
});

Coin.displayName = 'Coin';

export default Coin;