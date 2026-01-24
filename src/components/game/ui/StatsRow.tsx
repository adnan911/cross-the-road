
interface StatsRowProps {
    score: number;
    coins: number;
    best: number;
}

const StatsRow = ({ score, coins, best }: StatsRowProps) => {
    return (
        <div className="h-16 w-full grid grid-cols-3 gap-1 px-2 py-2">
            <div className="bg-card/50 rounded-lg border border-border/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Score</span>
                <span className="font-arcade text-lg text-primary">{score}</span>
            </div>

            <div className="bg-card/50 rounded-lg border border-border/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Coins</span>
                <span className="font-arcade text-lg text-yellow-500">{coins}</span>
            </div>

            <div className="bg-card/50 rounded-lg border border-border/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Best</span>
                <span className="font-arcade text-lg text-secondary">{best}</span>
            </div>
        </div>
    );
};

export default StatsRow;
