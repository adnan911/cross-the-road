import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WalletConnect } from '../WalletConnect';
import { CrossTheRoadNFTABI, CONTRACT_ADDRESS } from '../../contracts/abi';
import { base } from 'wagmi/chains';
import { toast } from 'sonner';
import './ReportCard.css';

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
  deathCause,
  onClose
}: ReportCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("NFT Minted Successfully!", {
        description: `Transaction Hash: ${hash}`,
      });
    }
  }, [isSuccess, hash]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `crossy-road-report-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download report card:', error);
      toast.error("Failed to download report.");
    }
  };

  const handleMint = () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first.");
      return;
    }
    /* 
       CONTRACT_ADDRESS is typed as a specific string constant in abi.ts, 
       so checking against 0x0...0 is technically impossible in TS if the types don't overlap,
       but good for runtime safety if types were looser. 
       However, TS is complaining about lack of overlap. 
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((CONTRACT_ADDRESS as any) === "0x0000000000000000000000000000000000000000") {
      toast.error("Contract not deployed yet. Please set address in contracts/abi.ts");
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CrossTheRoadNFTABI,
      functionName: 'mint',
      args: [address, BigInt(score)],
      account: address,
      chain: base,
    });
  };

  const progressPercentage = Math.min((score / (highScore || 1)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 report-card-overlay"
    >
      <div className="relative flex flex-col items-center">

        {/* Main Card */}
        <div className="level-up-card" ref={cardRef}>
          {/* Close Button */}
          <button onClick={onClose} className="card-close-btn">
            <X className="w-6 h-6" />
          </button>

          {/* Header / Badge Section */}
          <div className="card-header">
            <div className="star-badge">
              <div className="star-content">
                <span className="star-label">SCORE</span>
                <span className="star-value">{score}</span>
              </div>
            </div>
            <h1 className="card-title">YOUR REPORT!</h1>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
              <span className="progress-text">High Score: {highScore}</span>
            </div>
          </div>

          {/* Stats List */}
          <div className="stats-list">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <Trophy className="stat-icon" />
              </div>
              <div className="stat-info">
                <h3>PLAYER SCORE</h3>
                <p>{score} Points</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                {deathCause === 'water' ? <span className="stat-emoji">🌊</span> : <span className="stat-emoji">🚗</span>}
              </div>
              <div className="stat-info">
                <h3>CAUSE OF DEATH</h3>
                <p>{deathCause === 'water' ? 'Drowned in River' : 'Hit by Car'}</p>
              </div>
            </div>

            {/* Only show wallet connect if not connected, purely for utility inside the card if needed, 
                    but design wise it might be better outside or subtle. 
                    User asked for "Collect" button. We will put wallet connect logic in the collect button or nearby.
                 */}

          </div>

          {/* Footer / Collect Button */}
          <div className="card-footer">
            <Button
              className="collect-btn"
              onClick={handleMint}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? 'MINTING...' : 'COLLECT (MINT NFT)'}
            </Button>
            <Button
              variant="ghost"
              className="download-link"
              onClick={handleDownload}
            >
              Download Image
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;

