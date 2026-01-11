import { motion } from 'framer-motion';
import GameBoard from '@/components/game/GameBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-6"
      >
        <h1 className="font-arcade text-2xl md:text-4xl text-foreground mb-2">
          <span className="text-primary">CROSSY</span>{' '}
          <span className="text-secondary">ROAD</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Cross the road, avoid the cars!
        </p>
      </motion.div>
      
      {/* Game */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <GameBoard />
      </motion.div>
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-muted-foreground/60 text-xs"
      >
        <p>Dodge traffic and go as far as you can!</p>
      </motion.footer>
    </div>
  );
};

export default Index;
