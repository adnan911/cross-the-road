import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  disabled: boolean;
}

const MobileControls = ({ onMove, disabled }: MobileControlsProps) => {
  const handlePress = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!disabled) {
      onMove(direction);
    }
  };

  const buttonClass = `
    w-14 h-14 rounded-xl bg-card/80 backdrop-blur-sm border border-border
    flex items-center justify-center text-foreground
    active:bg-primary active:text-primary-foreground active:scale-95
    transition-all duration-100 touch-manipulation
    disabled:opacity-30
  `;

  return (
    <div className="md:hidden flex flex-col items-center gap-2 mt-4">
      <motion.button
        className={buttonClass}
        whileTap={{ scale: 0.9 }}
        onTouchStart={() => handlePress('up')}
        disabled={disabled}
      >
        <ChevronUp className="w-8 h-8" />
      </motion.button>
      
      <div className="flex gap-2">
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
          onTouchStart={() => handlePress('left')}
          disabled={disabled}
        >
          <ChevronLeft className="w-8 h-8" />
        </motion.button>
        
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
          onTouchStart={() => handlePress('down')}
          disabled={disabled}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
        
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
          onTouchStart={() => handlePress('right')}
          disabled={disabled}
        >
          <ChevronRight className="w-8 h-8" />
        </motion.button>
      </div>
    </div>
  );
};

export default MobileControls;
