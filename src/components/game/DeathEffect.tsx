import { motion } from 'framer-motion';

interface DeathEffectProps {
  type: 'car' | 'water';
  x: number;
  y: number;
  gridSize: number;
  playerSize: number;
}

const DeathEffect = ({ type, x, y, gridSize, playerSize }: DeathEffectProps) => {
  if (type === 'water') {
    // Splash effect
    return (
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: x - playerSize / 2,
          bottom: y * gridSize,
          width: playerSize,
          height: playerSize,
        }}
      >
        {/* Water rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full"
            style={{ borderColor: 'hsl(var(--water))' }}
            initial={{ width: 10, height: 10, opacity: 0.8 }}
            animate={{ 
              width: [10, 60 + i * 20], 
              height: [10, 60 + i * 20], 
              opacity: [0.8, 0] 
            }}
            transition={{ 
              duration: 0.6, 
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
        
        {/* Splash droplets */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`drop-${i}`}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
            style={{ background: 'hsl(var(--water))' }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i / 8) * Math.PI * 2) * 40,
              y: [0, Math.sin((i / 8) * Math.PI * 2) * 30 - 20, 20],
              opacity: [1, 0.8, 0],
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </div>
    );
  }

  // Splat effect for car
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: x - playerSize / 2,
        bottom: y * gridSize,
        width: playerSize,
        height: playerSize,
      }}
    >
      {/* Impact flash */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'hsl(var(--destructive))' }}
        initial={{ width: 10, height: 10, opacity: 1 }}
        animate={{ width: 80, height: 80, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Debris particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ 
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: i % 2 === 0 ? 'hsl(var(--player))' : 'hsl(var(--destructive))',
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: Math.cos((i / 12) * Math.PI * 2) * (30 + Math.random() * 30),
            y: Math.sin((i / 12) * Math.PI * 2) * (30 + Math.random() * 30),
            opacity: [1, 0.8, 0],
            rotate: 360 + Math.random() * 360,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}

      {/* Stars/impact marks */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-arcade text-xl"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.5, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 0.4 }}
      >
        💥
      </motion.div>
    </div>
  );
};

export default DeathEffect;
