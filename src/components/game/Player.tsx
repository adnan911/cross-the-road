import { motion } from 'framer-motion';

interface PlayerProps {
  isHopping: boolean;
}

const Player = ({ isHopping }: PlayerProps) => {
  return (
    <motion.div
      className="absolute z-20 flex items-center justify-center"
      style={{ width: 40, height: 40 }}
      animate={{
        scale: isHopping ? [1, 1.2, 1] : 1,
        y: isHopping ? [0, -8, 0] : 0,
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {/* Chicken body */}
      <div className="relative">
        {/* Shadow */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"
          animate={{ scale: isHopping ? 0.6 : 1 }}
        />
        
        {/* Body */}
        <div className="relative w-8 h-8 bg-game-player rounded-full shadow-lg">
          {/* Wings */}
          <div className="absolute top-3 -left-1 w-2 h-3 bg-secondary/80 rounded-full" />
          <div className="absolute top-3 -right-1 w-2 h-3 bg-secondary/80 rounded-full" />
          
          {/* Head feathers */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-1 h-3 bg-destructive rounded-full" />
            <div className="w-1 h-4 bg-destructive rounded-full" />
            <div className="w-1 h-3 bg-destructive rounded-full" />
          </div>
          
          {/* Eyes */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-background rounded-full" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-background rounded-full" />
          
          {/* Beak */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-orange-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default Player;
