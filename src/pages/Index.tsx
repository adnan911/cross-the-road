import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameScreen from '@/components/game/GameScreen';
import StartScreen from '@/components/game/StartScreen';
import Shop from '@/components/game/Shop';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showShop, setShowShop] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col items-center justify-start overflow-hidden">
      <AnimatePresence mode="wait">
        {showShop ? (
          <motion.div
            key="shop"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50"
          >
            <Shop onBack={() => setShowShop(false)} />
          </motion.div>
        ) : !gameStarted ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50"
          >
            <StartScreen
              onPlay={() => setGameStarted(true)}
              onOpenShop={() => setShowShop(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <GameScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
