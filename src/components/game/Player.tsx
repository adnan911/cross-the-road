import { motion } from 'framer-motion';
import { SkinType } from '@/hooks/useGameLogic';

interface PlayerProps {
  isHopping: boolean;
  skin?: SkinType;
}

const ChickenSkin = () => (
  <div className="relative">
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
);

const DuckSkin = () => (
  <div className="relative">
    <div className="relative w-8 h-8 rounded-full shadow-lg" style={{ background: '#FFA500' }}>
      <div className="absolute top-3 -left-1 w-2 h-3 rounded-full" style={{ background: '#FF8C00' }} />
      <div className="absolute top-3 -right-1 w-2 h-3 rounded-full" style={{ background: '#FF8C00' }} />
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: '#FFA500' }} />
      <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-background rounded-full" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-background rounded-full" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-2 rounded-b-lg" style={{ background: '#FFD700' }} />
    </div>
  </div>
);

const FrogSkin = () => (
  <div className="relative">
    <div className="relative w-8 h-7 rounded-full shadow-lg" style={{ background: '#4CAF50' }}>
      <div className="absolute -top-2 left-1 w-3 h-3 rounded-full" style={{ background: '#4CAF50' }}>
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-background rounded-full" />
      </div>
      <div className="absolute -top-2 right-1 w-3 h-3 rounded-full" style={{ background: '#4CAF50' }}>
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-background rounded-full" />
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full" style={{ background: '#388E3C' }} />
      <div className="absolute top-3 left-0 w-2 h-3 rounded-full" style={{ background: '#66BB6A' }} />
      <div className="absolute top-3 right-0 w-2 h-3 rounded-full" style={{ background: '#66BB6A' }} />
    </div>
  </div>
);

const BunnySkin = () => (
  <div className="relative">
    <div className="relative w-7 h-8 rounded-full shadow-lg" style={{ background: '#FFB6C1' }}>
      {/* Ears */}
      <div className="absolute -top-4 left-1 w-2 h-5 rounded-full" style={{ background: '#FFB6C1' }}>
        <div className="absolute inset-1 rounded-full" style={{ background: '#FFC0CB' }} />
      </div>
      <div className="absolute -top-4 right-1 w-2 h-5 rounded-full" style={{ background: '#FFB6C1' }}>
        <div className="absolute inset-1 rounded-full" style={{ background: '#FFC0CB' }} />
      </div>
      <div className="absolute top-2 left-1.5 w-1.5 h-2 bg-background rounded-full" />
      <div className="absolute top-2 right-1.5 w-1.5 h-2 bg-background rounded-full" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-full" style={{ background: '#FF69B4' }} />
      {/* Whiskers */}
      <div className="absolute top-4 left-0 w-2 h-px" style={{ background: '#999' }} />
      <div className="absolute top-5 left-0 w-2 h-px" style={{ background: '#999' }} />
      <div className="absolute top-4 right-0 w-2 h-px" style={{ background: '#999' }} />
      <div className="absolute top-5 right-0 w-2 h-px" style={{ background: '#999' }} />
    </div>
  </div>
);

const CatSkin = () => (
  <div className="relative">
    <div className="relative w-8 h-7 rounded-full shadow-lg" style={{ background: '#808080' }}>
      {/* Ears */}
      <div 
        className="absolute -top-2 left-0.5 w-0 h-0"
        style={{
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: '8px solid #808080',
        }}
      />
      <div 
        className="absolute -top-2 right-0.5 w-0 h-0"
        style={{
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: '8px solid #808080',
        }}
      />
      <div className="absolute top-2 left-1.5 w-2 h-1.5 rounded-full" style={{ background: '#90EE90' }} />
      <div className="absolute top-2 right-1.5 w-2 h-1.5 rounded-full" style={{ background: '#90EE90' }} />
      <div className="absolute top-2.5 left-2 w-1 h-1 bg-foreground rounded-full" />
      <div className="absolute top-2.5 right-2 w-1 h-1 bg-foreground rounded-full" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1 rounded-full" style={{ background: '#FFC0CB' }} />
      {/* Whiskers */}
      <div className="absolute top-4 -left-1 w-3 h-px" style={{ background: '#555' }} />
      <div className="absolute top-5 -left-1 w-3 h-px" style={{ background: '#555' }} />
      <div className="absolute top-4 -right-1 w-3 h-px" style={{ background: '#555' }} />
      <div className="absolute top-5 -right-1 w-3 h-px" style={{ background: '#555' }} />
    </div>
  </div>
);

const Player = ({ isHopping, skin = 'chicken' }: PlayerProps) => {
  const renderSkin = () => {
    switch (skin) {
      case 'duck': return <DuckSkin />;
      case 'frog': return <FrogSkin />;
      case 'bunny': return <BunnySkin />;
      case 'cat': return <CatSkin />;
      default: return <ChickenSkin />;
    }
  };

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
      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"
        animate={{ scale: isHopping ? 0.6 : 1 }}
      />
      
      {renderSkin()}
    </motion.div>
  );
};

export default Player;
