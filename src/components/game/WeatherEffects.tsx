import { useMemo } from 'react';
import { motion } from 'framer-motion';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog';

interface WeatherEffectsProps {
  weather: WeatherType;
  width: number;
  height: number;
}

const WeatherEffects = ({ weather, width, height }: WeatherEffectsProps) => {
  const particles = useMemo(() => {
    if (weather === 'clear') return [];
    
    const count = weather === 'fog' ? 8 : 40;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      size: weather === 'snow' ? 2 + Math.random() * 4 : 1,
      speed: weather === 'snow' ? 3 + Math.random() * 2 : 0.8 + Math.random() * 0.4,
    }));
  }, [weather]);

  if (weather === 'clear') return null;

  if (weather === 'fog') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${(p.id * 15) % 100}%`,
              width: width * 0.4,
              height: height * 0.15,
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8 + p.delay * 2,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: weather === 'rain' ? 15 : p.size,
            background: weather === 'rain' 
              ? 'linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.7))'
              : 'radial-gradient(circle, white 0%, rgba(255,255,255,0.5) 100%)',
            borderRadius: weather === 'snow' ? '50%' : 0,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: height + 20,
            opacity: [0, 1, 1, 0],
            x: weather === 'snow' ? [0, 10, -5, 0] : 0,
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            delay: p.delay,
            ease: weather === 'rain' ? 'linear' : 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default WeatherEffects;
