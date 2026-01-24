import { Shield, Zap, Magnet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PowerUpType, ActivePowerUp } from '@/hooks/useGameLogic';

interface UtilityPanelProps {
    score: number;
    activePowerUps: ActivePowerUp[];
    // goal: any; // Todo: Implement goal logic
}

const PowerUpCard = ({
    type,
    label,
    icon: Icon,
    isActive,
    isCooldown
}: {
    type: PowerUpType,
    label: string,
    icon: any,
    isActive: boolean,
    isCooldown: boolean
}) => {
    return (
        <div className={`
            flex-1 min-w-0 rounded-lg border p-1.5 flex flex-col items-center gap-1 relative overflow-hidden
            ${isActive ? 'bg-primary/10 border-primary' : 'bg-card border-border/50'}
        `}>
            <div className="flex items-center gap-1 mb-0.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-[10px] font-bold uppercase truncate max-w-[50px]">{label}</span>
            </div>

            {isActive ? (
                <div className="w-full h-6 flex items-center justify-center bg-primary/20 rounded text-[10px] font-bold text-primary animate-pulse">
                    Active
                </div>
            ) : isCooldown ? (
                <div className="w-full h-6 flex items-center justify-center bg-muted/50 rounded text-[10px] text-muted-foreground">
                    8s
                </div>
            ) : (
                <Button variant="secondary" size="sm" className="w-full h-6 text-[10px] px-0">
                    USE
                </Button>
            )}
        </div>
    );
};

const UtilityPanel = ({ score, activePowerUps }: UtilityPanelProps) => {
    const hasPowerUp = (type: PowerUpType) => activePowerUps.some(p => p.type === type && p.endTime > Date.now());

    // Mock progress calculation
    const progress = Math.min((score % 50) / 50 * 100, 100);
    const goalStep = Math.floor(score / 50) + 1;

    return (
        <div className="w-full flex flex-col gap-2 px-2 py-2">
            {/* Goal Strip */}
            <div className="w-full bg-card rounded-lg border border-border/50 p-2 flex flex-col gap-1.5 shadow-sm">
                <div className="flex justify-between items-center text-xs font-medium">
                    <span className="font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        GOAL: Reach {goalStep * 50} steps
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">+{25} Coins</span>
                </div>

                <div className="w-full h-2.5 bg-secondary/10 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                    {/* Checkpoints */}
                    <div className="absolute top-0 right-0 w-full h-full flex justify-around opacity-30">
                        <div className="w-[1px] h-full bg-background/50" />
                        <div className="w-[1px] h-full bg-background/50" />
                        <div className="w-[1px] h-full bg-background/50" />
                    </div>
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
            </div>

            {/* Power Ups Row */}
            <div className="flex gap-2 w-full">
                <PowerUpCard
                    type="invincibility"
                    label="Shield"
                    icon={Shield}
                    isActive={hasPowerUp('invincibility')}
                    isCooldown={false}
                />
                <PowerUpCard
                    type="slowmo"
                    label="Slow"
                    icon={Zap} // Turtle icon not standard in lucide, using Zap for slow? Maybe Activity or Timer. Using Zap as place holder or Clock
                    isActive={hasPowerUp('slowmo')}
                    isCooldown={false}
                />
                <PowerUpCard
                    type="magnet"
                    label="Magnet"
                    icon={Magnet}
                    isActive={hasPowerUp('magnet')}
                    isCooldown={false}
                />
            </div>
        </div>
    );
};

export default UtilityPanel;
