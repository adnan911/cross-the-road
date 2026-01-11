import { memo } from 'react';
import { Car as CarType } from '@/hooks/useGameLogic';

interface CarProps {
  car: CarType;
}

const carColorClasses: Record<CarType['color'], string> = {
  red: 'bg-game-car-red',
  blue: 'bg-game-car-blue',
  yellow: 'bg-game-car-yellow',
  green: 'bg-game-car-green',
  purple: 'bg-game-car-purple',
};

const Car = memo(({ car }: CarProps) => {
  const isFlipped = car.direction === -1;
  
  return (
    <div
      className={`absolute ${carColorClasses[car.color]} rounded-lg shadow-lg transition-none`}
      style={{
        left: car.x,
        width: car.width,
        height: 35,
        top: '50%',
        transform: `translateY(-50%) scaleX(${isFlipped ? -1 : 1})`,
      }}
    >
      {/* Car body details */}
      <div className="relative w-full h-full">
        {/* Roof */}
        <div 
          className="absolute bg-black/20 rounded"
          style={{
            left: '30%',
            right: '20%',
            top: '15%',
            bottom: '25%',
          }}
        />
        
        {/* Windows */}
        <div 
          className="absolute bg-accent/60 rounded-sm"
          style={{
            left: '35%',
            width: '20%',
            top: '20%',
            height: '35%',
          }}
        />
        <div 
          className="absolute bg-accent/60 rounded-sm"
          style={{
            left: '58%',
            width: '15%',
            top: '20%',
            height: '35%',
          }}
        />
        
        {/* Headlights */}
        <div 
          className="absolute bg-secondary rounded-full shadow-[0_0_8px_hsl(var(--secondary))]"
          style={{
            right: '5%',
            top: '30%',
            width: 8,
            height: 8,
          }}
        />
        <div 
          className="absolute bg-secondary rounded-full shadow-[0_0_8px_hsl(var(--secondary))]"
          style={{
            right: '5%',
            bottom: '25%',
            width: 8,
            height: 8,
          }}
        />
        
        {/* Tail lights */}
        <div 
          className="absolute bg-destructive rounded-full"
          style={{
            left: '3%',
            top: '30%',
            width: 6,
            height: 6,
          }}
        />
        <div 
          className="absolute bg-destructive rounded-full"
          style={{
            left: '3%',
            bottom: '25%',
            width: 6,
            height: 6,
          }}
        />
        
        {/* Wheels */}
        <div 
          className="absolute bg-background rounded-full border-2 border-muted"
          style={{
            left: '15%',
            bottom: '-6px',
            width: 14,
            height: 14,
          }}
        />
        <div 
          className="absolute bg-background rounded-full border-2 border-muted"
          style={{
            right: '15%',
            bottom: '-6px',
            width: 14,
            height: 14,
          }}
        />
      </div>
    </div>
  );
});

Car.displayName = 'Car';

export default Car;
