import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { Avatar, Name, Identity, Badge } from '@coinbase/onchainkit/identity';
import { WalletConnect } from '../WalletConnect';
import './StartScreen.css';

interface StartScreenProps {
    onPlay: () => void;
    onOpenShop: () => void;
}

const StartScreen = ({ onPlay, onOpenShop }: StartScreenProps) => {
    const { address, isConnected } = useAccount();

    return (
        <div className="start-screen-container">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="start-content"
            >


                {/* Main Action Buttons */}
                <div className="action-wrapper">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="menu-btn play-btn" onClick={onPlay}>
                            PLAY
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="menu-btn shop-btn" onClick={onOpenShop}>
                            SHOP
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="menu-btn settings-btn" onClick={() => { }}>
                            SETTINGS
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
                                <Avatar className="h-12 w-12 mb-1 border-2 border-white/20 shadow-lg" />
                                <Name className="text-white font-fredoka text-lg font-bold uppercase tracking-wider" />
                            </Identity>
                        </div>
                    ) : (
                        <WalletConnect />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StartScreen;


