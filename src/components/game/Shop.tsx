import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Coins, Trophy, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnlockableSkin, SkinType, DEFAULT_SKINS } from '@/hooks/useGameLogic';
import Player from './Player';

interface ShopProps {
    onBack: () => void;
}

const Shop = ({ onBack }: ShopProps) => {
    const [skins, setSkins] = useState<UnlockableSkin[]>([]);
    const [selectedSkin, setSelectedSkin] = useState<SkinType>('chicken');
    const [totalCoins, setTotalCoins] = useState(0);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        // Load data from localStorage
        const savedSkins = localStorage.getItem('crossySkins');
        const savedSelectedSkin = localStorage.getItem('crossySelectedSkin');
        const savedTotalCoins = localStorage.getItem('crossyTotalCoins');
        const savedHighScore = localStorage.getItem('crossyHighScore');

        if (savedSkins) {
            setSkins(JSON.parse(savedSkins));
        } else {
            setSkins(DEFAULT_SKINS);
        }

        if (savedSelectedSkin) {
            setSelectedSkin(savedSelectedSkin as SkinType);
        }

        if (savedTotalCoins) {
            setTotalCoins(parseInt(savedTotalCoins, 10));
        }

        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore, 10));
        }
    }, []);

    const handleSelectSkin = (skinId: SkinType) => {
        setSelectedSkin(skinId);
        localStorage.setItem('crossySelectedSkin', skinId);
    };

    return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="hover:bg-muted/50 rounded-full h-12 w-12 p-0"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <h1 className="font-arcade text-3xl md:text-4xl text-primary tracking-widest">SHOP</h1>
                    <div className="w-12" /> {/* Spacer for centering */}
                </div>

                {/* Stats Bar */}
                <div className="flex justify-center gap-8 mb-8">
                    <div className="bg-card/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-border shadow-sm flex items-center gap-3">
                        <Coins className="w-6 h-6 text-game-road-marking" />
                        <span className="font-arcade text-xl">{totalCoins}</span>
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-border shadow-sm flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-secondary" />
                        <span className="font-arcade text-xl">{highScore}</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                    {skins.map((skin) => {
                        const isSelected = selectedSkin === skin.id;
                        const progress = skin.requirement.type === 'coins'
                            ? Math.min(100, (totalCoins / skin.requirement.value) * 100)
                            : Math.min(100, (highScore / skin.requirement.value) * 100);

                        return (
                            <motion.button
                                key={skin.id}
                                layout
                                onClick={() => skin.unlocked && handleSelectSkin(skin.id)}
                                className={`group relative aspect-square rounded-3xl border-4 transition-all duration-300 overflow-hidden ${isSelected
                                    ? 'border-primary bg-primary/10 shadow-xl scale-[1.02]'
                                    : skin.unlocked
                                        ? 'border-border hover:border-primary/50 bg-card hover:shadow-lg'
                                        : 'border-muted bg-muted/30 cursor-not-allowed opacity-80'
                                    }`}
                                whileHover={skin.unlocked ? { y: -4 } : {}}
                                whileTap={skin.unlocked ? { scale: 0.98 } : {}}
                            >
                                {/* Selected Badge */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-3 right-3 z-20 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg"
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Character Preview - Centered */}
                                <div className="absolute inset-0 flex items-center justify-center mb-6 z-10">
                                    <div
                                        className={`transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'
                                            } ${!skin.unlocked ? 'grayscale opacity-50' : ''}`}
                                    >
                                        {!skin.unlocked ? (
                                            <Lock className="w-10 h-10 text-foreground/50" />
                                        ) : (
                                            <div className="scale-[3] transform">
                                                <Player isHopping={isSelected} skin={skin.id} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info - Bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/20 to-transparent z-20">
                                    <h3 className="font-arcade text-sm md:text-base truncate text-center mb-1 drop-shadow-sm">{skin.name}</h3>

                                    {!skin.unlocked && (
                                        <div className="w-full flex flex-col gap-1 items-center">
                                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                                                {skin.requirement.type === 'coins' ? (
                                                    <Coins className="w-3 h-3 text-game-road-marking" />
                                                ) : (
                                                    <Trophy className="w-3 h-3 text-secondary" />
                                                )}
                                                <span>{skin.requirement.value}</span>
                                            </div>
                                            <div className="h-1.5 w-full max-w-[80%] bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: skin.requirement.type === 'coins'
                                                            ? 'hsl(var(--road-marking))'
                                                            : 'hsl(var(--secondary))',
                                                    }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {skin.unlocked && !isSelected && (
                                        <div className="h-4 flex items-center justify-center">
                                            <span className="text-[10px] text-muted-foreground font-arcade opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                SELECT
                                            </span>
                                        </div>
                                    )}

                                    {isSelected && (
                                        <div className="h-4 flex items-center justify-center">
                                            <span className="text-[10px] text-primary font-arcade font-bold tracking-wide">
                                                EQUIPPED
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Shop;
