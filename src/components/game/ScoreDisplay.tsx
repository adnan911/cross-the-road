import { motion } from 'framer-motion';
import { Trophy, Footprints } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

const ScoreDisplay = ({ score, highScore }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-[600px] px-4">
      <motion.div
        className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Footprints className="w-5 h-5 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">SCORE</span>
          <motion.span
            key={score}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="font-arcade text-lg text-foreground"
          >
            {score}
          </motion.span>
        </div>
      </motion.div>
      
      <motion.div
        className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Trophy className="w-5 h-5 text-secondary" />
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">BEST</span>
          <span className="font-arcade text-lg text-secondary">
            {highScore}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ScoreDisplay;
