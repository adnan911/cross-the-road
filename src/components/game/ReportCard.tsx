import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Coins, Download, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WalletConnect } from '../WalletConnect';
import { CrossTheRoadNFTABI, CONTRACT_ADDRESS } from '../../contracts/abi';
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
  coinsCollected,
  totalCoinsEver,
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

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

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
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast.error("Contract not deployed yet. Please set address in contracts/abi.ts");
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CrossTheRoadNFTABI,
      functionName: 'mint',
      args: [address, BigInt(score)],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 report-card-preview"
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Close button outside the card */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="card" ref={cardRef}>
          <section className="scene-section">
            <div className="road-texture"></div>
            <div className="road-marking"></div>

            <div className="crash-scene">
              <div className="text-4xl car-visual">🚗</div>
              <div className="boom-visual">💥</div>
              {/* Debris particles */}
              <div className="debris"></div>
              <div className="debris"></div>
              <div className="debris"></div>
              <div className="debris"></div>
              <div className="debris"></div>
            </div>

            <div className="filter"></div>
          </section>

          <section className="content-section">
            <div className="weather-info">
              <div className="left-side">
                <div className="icon">
                  {deathCause === 'water' ? (
                    <span className="text-2xl">🌊</span>
                  ) : (
                    <span className="text-2xl">🚗</span>
                  )}
                </div>
                <p>{deathCause === 'water' ? 'Drowned' : 'Crashed'}</p>
              </div>
              <div className="right-side">
                <div className="location">
                  <div>
                    <svg
                      version="1.0"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="64px"
                      height="64px"
                      viewBox="0 0 64 64"
                      xmlSpace="preserve"
                      fill="#ffffff"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill="#ffffff"
                          d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"
                        ></path>
                      </g>
                    </svg>
                    <span>CROSSY</span>
                  </div>
                </div>
                <p>{date}</p>
                <p className="temperature">{score}</p>
              </div>
            </div>
            <div className="forecast">
              <div>
                <p className="flex items-center gap-2"><Trophy className="w-4 h-4" /> High Score</p>
                <p>{highScore}</p>
              </div>
              <div className="separator"></div>
              <div>
                <p className="flex items-center gap-2"><Coins className="w-4 h-4" /> Coins</p>
                <p>{coinsCollected}</p>
              </div>
              <div className="separator"></div>
              <div>
                <p className="flex items-center gap-2"><Trophy className="w-4 h-4 opacity-70" /> Total Coins</p>
                <p>{totalCoinsEver}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold text-sm">BASE MAINNET</span>
              <WalletConnect />
            </div>

            {isConnected ? (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-arcade w-full"
                onClick={handleMint}
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? 'Minting...' : 'Mint as NFT'}
              </Button>
            ) : (
              <div className="text-center text-white/60 text-xs">Connect wallet to mint</div>
            )}
          </div>

          <Button
            className="bg-white text-black hover:bg-gray-200 gap-2 font-arcade tracking-wider w-full"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download Report Card
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
