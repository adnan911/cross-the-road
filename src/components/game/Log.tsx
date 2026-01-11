import { memo } from 'react';
import { Log as LogType } from '@/hooks/useGameLogic';

interface LogProps {
  log: LogType;
  gridSize: number;
}

const Log = memo(({ log, gridSize }: LogProps) => {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2"
      style={{
        left: log.x,
        width: log.width,
        height: gridSize - 10,
      }}
    >
      {/* Log body */}
      <div className="relative w-full h-full">
        {/* Main log */}
        <div 
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{
            background: 'linear-gradient(180deg, hsl(30 50% 35%) 0%, hsl(25 45% 25%) 50%, hsl(20 40% 20%) 100%)',
          }}
        />
        
        {/* Wood grain lines */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {Array.from({ length: Math.floor(log.width / 20) }).map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-px opacity-30"
              style={{
                left: `${(i + 1) * 20}px`,
                background: 'linear-gradient(180deg, transparent, hsl(20 30% 15%), transparent)',
              }}
            />
          ))}
        </div>
        
        {/* End rings */}
        <div 
          className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 opacity-50"
          style={{
            borderColor: 'hsl(30 40% 40%)',
            background: 'hsl(35 45% 50%)',
          }}
        />
        <div 
          className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 opacity-50"
          style={{
            borderColor: 'hsl(30 40% 40%)',
            background: 'hsl(35 45% 50%)',
          }}
        />
        
        {/* Highlight */}
        <div 
          className="absolute top-1 left-2 right-2 h-2 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(40 50% 60%), transparent)',
          }}
        />
      </div>
    </div>
  );
});

Log.displayName = 'Log';

export default Log;
