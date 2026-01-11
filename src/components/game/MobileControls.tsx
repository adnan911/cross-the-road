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
    w-16 h-16 rounded-2xl bg-card/90 backdrop-blur-sm border-2 border-border
    flex items-center justify-center text-foreground
    active:bg-primary active:text-primary-foreground active:scale-90
    transition-all duration-75 touch-manipulation select-none
    disabled:opacity-30 shadow-lg
  `;

  return (
    <div className="flex flex-col items-center gap-1 mt-2">
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
        <ChevronUp className="w-10 h-10" strokeWidth={3} />
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
          <ChevronLeft className="w-10 h-10" strokeWidth={3} />
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
          <ChevronDown className="w-10 h-10" strokeWidth={3} />
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
          <ChevronRight className="w-10 h-10" strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};

export default MobileControls;
