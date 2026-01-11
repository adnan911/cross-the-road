import { motion } from 'framer-motion';
import GameBoard from '@/components/game/GameBoard';

const Index = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col items-center justify-start pt-4 pb-2 px-2 overflow-hidden">
      {/* Background pattern - simplified for mobile */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-2"
      >
        <h1 className="font-arcade text-xl sm:text-2xl md:text-4xl text-foreground mb-1">
          <span className="text-primary">CROSSY</span>{' '}
          <span className="text-secondary">ROAD</span>
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Cross the road, avoid the cars!
        </p>
      </motion.div>
      
      {/* Game */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
        className="flex-1 flex items-start"
      >
        <GameBoard />
      </motion.div>
    </div>
  );
};

export default Index;
