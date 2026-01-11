import { motion } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverlayProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverlay = ({ score, highScore, onRestart }: GameOverlayProps) => {
  const isNewHighScore = score >= highScore && score > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-30"
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
        className="text-center space-y-6"
      >
        <motion.h2
          className="font-arcade text-2xl md:text-3xl text-destructive"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          GAME OVER
        </motion.h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-muted-foreground font-medium">Score:</span>
            <span className="font-arcade text-xl text-foreground">{score}</span>
          </div>
          
          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-secondary"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-arcade text-sm">NEW HIGH SCORE!</span>
              <Trophy className="w-5 h-5" />
            </motion.div>
          )}
          
          <div className="flex items-center justify-center gap-3 text-sm">
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">Best:</span>
            <span className="font-arcade text-secondary">{Math.max(score, highScore)}</span>
          </div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onRestart}
            size="lg"
            className="font-arcade text-xs gap-2 px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            PLAY AGAIN
          </Button>
        </motion.div>
        
        <p className="text-muted-foreground/60 text-xs">
          Press <span className="font-arcade text-primary">SPACE</span> or{' '}
          <span className="font-arcade text-primary">ENTER</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GameOverlay;
