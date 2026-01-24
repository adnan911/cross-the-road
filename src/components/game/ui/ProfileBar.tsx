import { Settings, Mail, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfileBar = () => {
    return (
        <div className="h-14 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 flex items-center justify-between px-4 z-50">
            {/* Left: Level/XP */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <span className="font-arcade text-xs text-primary font-bold">12</span>
                </div>
                <div className="flex flex-col gap-0.5 w-24">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                        <span>XP</span>
                        <span>450/1000</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[45%]" />
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
};

export default ProfileBar;
