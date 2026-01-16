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
    w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-background/60 backdrop-blur-md border-2 border-border/50
    flex items-center justify-center text-foreground/80
    active:bg-primary active:text-primary-foreground active:scale-90
    transition-all duration-75 touch-manipulation select-none
    disabled:opacity-20 shadow-xl hover:bg-background/80
  `;

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
      <motion.button
        className={buttonClass}
        whileTap={{ scale: 0.85 }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handlePress('up');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => handlePress('up')}
        disabled={disabled}
      >
        <ChevronUp className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={3} />
      </motion.button>

      <div className="flex gap-2">
        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.85 }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePress('left');
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => handlePress('left')}
          disabled={disabled}
        >
          <ChevronLeft className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={3} />
        </motion.button>

        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.85 }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePress('down');
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => handlePress('down')}
          disabled={disabled}
        >
          <ChevronDown className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={3} />
        </motion.button>

        <motion.button
          className={buttonClass}
          whileTap={{ scale: 0.85 }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePress('right');
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => handlePress('right')}
          disabled={disabled}
        >
          <ChevronRight className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};

export default MobileControls;
