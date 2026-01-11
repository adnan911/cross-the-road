import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ComboDisplayProps {
  combo: number;
  multiplier: number;
}

const ComboDisplay = ({ combo, multiplier }: ComboDisplayProps) => {
  if (combo < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="absolute top-2 left-2 z-30 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/90 backdrop-blur-sm shadow-lg"
      >
        <Zap className="w-4 h-4 text-primary-foreground" fill="currentColor" />
        <div className="flex flex-col">
          <span className="font-arcade text-[10px] text-primary-foreground leading-tight">
            {combo}x COMBO
          </span>
          {multiplier > 1 && (
            <span className="font-arcade text-[8px] text-primary-foreground/80">
              {multiplier}x BONUS
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComboDisplay;
