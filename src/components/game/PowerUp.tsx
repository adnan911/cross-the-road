import { motion } from 'framer-motion';
import { Shield, Magnet, Clock } from 'lucide-react';
import { PowerUpType } from '@/hooks/useGameLogic';

interface PowerUpProps {
  type: PowerUpType;
  collected: boolean;
}

const PowerUp = ({ type, collected }: PowerUpProps) => {
  if (collected) return null;

  const getIcon = () => {
    switch (type) {
      case 'invincibility':
        return <Shield className="w-4 h-4 text-white" />;
      case 'magnet':
        return <Magnet className="w-4 h-4 text-white" />;
      case 'slowmo':
        return <Clock className="w-4 h-4 text-white" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'invincibility':
        return 'from-blue-500 to-cyan-400';
      case 'magnet':
        return 'from-pink-500 to-rose-400';
      case 'slowmo':
        return 'from-purple-500 to-violet-400';
    }
  };

  return (
    <motion.div
      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getColor()} flex items-center justify-center shadow-lg`}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 rounded-lg bg-white/30"
      />
      {getIcon()}
    </motion.div>
  );
};

export default PowerUp;
