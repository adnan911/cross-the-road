import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { Avatar, Name, Identity, Badge } from '@coinbase/onchainkit/identity';
import { WalletConnect } from '../WalletConnect';
import './StartScreen.css';

interface StartScreenProps {
    onPlay: () => void;
}

const StartScreen = ({ onPlay }: StartScreenProps) => {
    const { address, isConnected } = useAccount();

    return (
        <div className="start-screen-container">
            {/* Background Elements */}
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="start-content"
            >
                {/* Title Section */}
                <div className="title-wrapper">
                    <motion.h1
                        className="game-title"
                        animate={{
                            y: [0, -15, 0],
                            rotateZ: [0, 2, -2, 0],
                            scale: [1, 1.02, 1]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 1]
                        }}
                    >
                        CROSS
                        <br />
                        <span className="text-gradient">THE ROAD</span>
                    </motion.h1>
                    <motion.div
                        className="title-glow"
                        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Main Action */}
                <div className="action-wrapper">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            className="play-btn-large"
                            onClick={onPlay}
                        >
                            PLAY GAME
                        </Button>
                    </motion.div>
                </div>

                {/* Player Identity or Wallet Connect */}
                <div className="wallet-wrapper">
                    {isConnected && address ? (
                        <div className="player-profile">
                            <Identity
                                address={address}
                                className="bg-transparent"
                            >
                                <Avatar className="h-16 w-16 mb-2 border-2 border-white/20 shadow-lg" />
                                <Name className="text-white font-fredoka text-xl font-bold uppercase tracking-wider" />
                                <Badge />
                            </Identity>
                        </div>
                    ) : (
                        <WalletConnect />
                    )}
                </div>

                {/* Footer info */}
                <div className="footer-info">
                    <p>Collect Coins & Unlock Skins!</p>
                </div>
            </motion.div>
        </div>
    );
};

export default StartScreen;


