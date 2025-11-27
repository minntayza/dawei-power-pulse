import { Atom, MapPin, Building2, Zap } from "lucide-react";

export function Header() {
  return (
    <header className="h-18 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-primary-subtle">
              <Atom className="w-7 h-7 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              SMR Command Center
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              MYANMAR STRATEGIC ANALYSIS
            </p>
          </div>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50">
          <MapPin className="w-4 h-4 text-energy-red" />
          <span className="text-sm font-medium text-foreground">4</span>
          <span className="text-xs text-muted-foreground">Sites</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50">
          <Building2 className="w-4 h-4 text-energy-blue" />
          <span className="text-sm font-medium text-foreground">7</span>
          <span className="text-xs text-muted-foreground">Load Centers</span>
        </div>

        <div className="flex items-center gap-3 px-5 py-2 rounded-xl bg-primary/10 border border-primary/30 glow-primary-subtle">
          <Zap className="w-5 h-5 text-primary" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-primary digital-readout">300</span>
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">MW</span>
          </div>
        </div>
      </div>
    </header>
  );
}
