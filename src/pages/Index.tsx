import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from '@/components/game/GameBoard';
import StartScreen from '@/components/game/StartScreen';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col items-center justify-start overflow-hidden">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50"
          >
            <StartScreen onPlay={() => setGameStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="game-board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center pt-2"
          >
            <GameBoard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
