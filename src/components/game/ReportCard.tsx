import { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Coins, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}: ReportCardProps) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  const cardRef = useRef<HTMLDivElement>(null);

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 report-card-preview"
    >
      <div className="relative">
        {/* Close button outside the card to not mess with the design */}
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

        <div className="flex justify-center mt-6">
          <Button className="bg-white text-black hover:bg-gray-200" disabled>
            Download Coming Soon
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
