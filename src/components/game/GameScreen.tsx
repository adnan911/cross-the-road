import { useRef } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import GameBoard from './GameBoard';
import ProfileBar from './ui/ProfileBar';
import StatsRow from './ui/StatsRow';
import UtilityPanel from './ui/UtilityPanel';
import ReportCard from './ReportCard';
import { Button } from '@/components/ui/button'; // Assuming button is needed or we can use MobileControls inside GameBoard

const GameScreen = () => {
    const gameLogic = useGameLogic();
    const {
        score,
        coinsCollected,
        highScore,
        activePowerUps,
        playerPos,
        isGameOver,
        deathCause,
        totalCoinsEver // Needed for ReportCard
    } = gameLogic;

    // Lift visual effects here to pass down if needed, or keep in GameBoard logic
    // Actually GameBoard needs logic for rendering lanes. 
    // Ideally GameBoard should be purely presentational, but refactoring useGameLogic out entirely 
    // requires passing A LOT of props. 
    // Strategy: GameScreen holds the Layout. GameBoard holds the Canvas/GameArea.
    // GameBoard will STILL use useGameLogic? 
    // NO, if we want GameScreen to show Stats from game, GameScreen needs access to the state.
    // So we MUST hoist useGameLogic to GameScreen.

    // We already called useGameLogic above. 
    // Now we pass EVERYTHING down to GameBoard.

    const [showReport, setShowReport] = useState(false); // Local state for report card modal

    return (
        <div className="flex flex-col h-[100dvh] w-full max-w-[480px] mx-auto bg-background overflow-hidden relative">
            {/* 1. Profile Bar (Fixed Top) */}
            <div className="flex-none z-50">
                <ProfileBar />
            </div>

            {/* 2. Utility Panel */}
            <div className="flex-none z-40 bg-background/95 backdrop-blur">
                <UtilityPanel score={score} activePowerUps={activePowerUps} />
            </div>

            {/* 3. Stats Row */}
            <div className="flex-none z-40 bg-background">
                <StatsRow score={score} coins={coinsCollected} best={highScore} />
            </div>

            {/* 4. Game Window (Fills remaining space) */}
            <div className="flex-1 relative overflow-hidden rounded-t-3xl shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)] z-0 mt-[-16px] pt-4 bg-slate-900">
                {/* 
                   We need to pass the ENTIRE gameLogic object to GameBoard 
                   so it doesn't re-instantiate its own hook.
                */}
                <GameBoard gameLogic={gameLogic} />
            </div>

            {/* Report Card Modal */}
            {/* 
                Refactor Note: Originally ReportCard state was in GameBoard. 
                We can keep it there OR move it here. 
                Let's keep local UI state (like ReportCard visibility) close to where it's triggered if specific to GameBoard,
                BUT GameOverlay (inside GameBoard) triggers it.
             */}
        </div>
    );
};

// We need to import useState for the above code to work
import { useState } from 'react';

export default GameScreen;
