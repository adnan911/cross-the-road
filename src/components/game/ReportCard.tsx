import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Trophy, Coins, MapPin, Skull, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportCardProps {
  score: number;
  highScore: number;
  coinsCollected: number;
  totalCoinsEver: number;
  deathCause: 'car' | 'water' | null;
  onClose: () => void;
}

const ReportCard = ({ 
  score, 
  highScore, 
  coinsCollected, 
  totalCoinsEver,
  deathCause, 
  onClose 
}: ReportCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadReport = async () => {
    if (!cardRef.current) return;

    // Create a canvas to render the report
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 550;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Inner border
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Title
    ctx.fillStyle = '#ffd93d';
    ctx.font = 'bold 28px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CROSSY ROAD', width / 2, 70);

    // Subtitle
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.fillText('SCORE REPORT', width / 2, 100);

    // Decorative line
    ctx.strokeStyle = '#ffd93d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.lineTo(width - 50, 120);
    ctx.stroke();

    // Stats section
    const drawStat = (label: string, value: string, y: number, icon: string, color: string) => {
      ctx.fillStyle = color;
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(icon, 50, y);
      
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillText(label, 85, y - 8);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Press Start 2P", monospace';
      ctx.fillText(value, 85, y + 15);
    };

    drawStat('FINAL SCORE', score.toString(), 170, '🏃', '#4ade80');
    drawStat('HIGH SCORE', highScore.toString(), 240, '🏆', '#fbbf24');
    drawStat('COINS THIS RUN', coinsCollected.toString(), 310, '🪙', '#facc15');
    drawStat('TOTAL COINS', totalCoinsEver.toString(), 380, '💰', '#f59e0b');

    // Death cause
    ctx.fillStyle = '#ef4444';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(deathCause === 'water' ? '🌊' : '🚗', 50, 450);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('CAUSE OF DEATH', 85, 442);
    
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px "Press Start 2P", monospace';
    ctx.fillText(deathCause === 'water' ? 'DROWNED' : 'HIT BY CAR', 85, 465);

    // New high score badge
    if (score >= highScore && score > 0) {
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 14px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⭐ NEW HIGH SCORE! ⭐', width / 2, 510);
    }

    // Date
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), width / 2, 540);

    // Download
    const link = document.createElement('a');
    link.download = `crossy-road-score-${score}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const isNewHighScore = score >= highScore && score > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-6 border-4 border-primary shadow-2xl max-w-sm w-full"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="font-arcade text-lg text-game-road-marking">CROSSY ROAD</h2>
          <p className="font-arcade text-xs text-primary mt-1">SCORE REPORT</p>
        </div>

        {/* Divider */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-game-road-marking to-transparent mb-4" />

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-card/20 rounded-lg p-3">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground font-arcade">FINAL SCORE</p>
              <p className="font-arcade text-lg text-foreground">{score}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-card/20 rounded-lg p-3">
            <Trophy className="w-6 h-6 text-game-road-marking" />
            <div>
              <p className="text-[10px] text-muted-foreground font-arcade">HIGH SCORE</p>
              <p className="font-arcade text-lg text-foreground">{highScore}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-card/20 rounded-lg p-3">
            <Coins className="w-6 h-6 text-game-road-marking" />
            <div>
              <p className="text-[10px] text-muted-foreground font-arcade">COINS THIS RUN</p>
              <p className="font-arcade text-lg text-foreground">{coinsCollected}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-card/20 rounded-lg p-3">
            <Skull className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-[10px] text-muted-foreground font-arcade">CAUSE OF DEATH</p>
              <p className="font-arcade text-sm text-destructive">
                {deathCause === 'water' ? '🌊 DROWNED' : '🚗 HIT BY CAR'}
              </p>
            </div>
          </div>
        </div>

        {/* New high score */}
        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mt-4 text-center"
          >
            <p className="font-arcade text-xs text-game-road-marking animate-pulse">
              ⭐ NEW HIGH SCORE! ⭐
            </p>
          </motion.div>
        )}

        {/* Download button */}
        <Button
          onClick={downloadReport}
          className="w-full mt-6 font-arcade text-xs gap-2 bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD REPORT
        </Button>

        {/* Date */}
        <p className="text-center text-muted-foreground/60 text-[8px] mt-3">
          {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReportCard;
