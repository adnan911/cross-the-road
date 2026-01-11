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
    w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-background/60 backdrop-blur-md border border-border/50
    flex items-center justify-center text-foreground/80
    active:bg-primary active:text-primary-foreground active:scale-90
    transition-all duration-75 touch-manipulation select-none
    disabled:opacity-20 shadow-lg hover:bg-background/80
  `;

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
      <motion.button
        className={buttonClass}
        whileTap={{ scale: 0.85 }}
        onTouchStart={(e) => {
          e.preventDefault();
          handlePress('up');
        }}
        onClick={() => handlePress('up')}
        disabled={disabled}
      >
        <ChevronUp className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
      </motion.button>
      
      <div className="flex gap-1">
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.85 }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('left');
          }}
          onClick={() => handlePress('left')}
          disabled={disabled}
        >
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
        </motion.button>
        
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.85 }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('down');
          }}
          onClick={() => handlePress('down')}
          disabled={disabled}
        >
          <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
        </motion.button>
        
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.85 }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('right');
          }}
          onClick={() => handlePress('right')}
          disabled={disabled}
        >
          <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
};

export default MobileControls;
