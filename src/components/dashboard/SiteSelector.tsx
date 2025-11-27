import { MapPin, Check, Shield, Droplets, Activity } from "lucide-react";
import { candidateSites, CandidateSite, getSeismicColor } from "@/data/smrData";
import { cn } from "@/lib/utils";

interface SiteSelectorProps {
  selectedSite: CandidateSite | null;
  onSiteSelect: (site: CandidateSite) => void;
}

export function SiteSelector({ selectedSite, onSiteSelect }: SiteSelectorProps) {
  return (
    <div className="p-5 border-b border-border/50">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2 font-semibold">
        <MapPin className="w-3.5 h-3.5" />
        Select Candidate Site
      </h3>
      
      <div className="space-y-3">
        {candidateSites.map((site) => {
          const isSelected = selectedSite?.id === site.id;
          
          return (
            <button
              key={site.id}
              onClick={() => onSiteSelect(site)}
              className={cn(
                "w-full text-left transition-all duration-300",
                isSelected ? "site-card-selected" : "site-card"
              )}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-base font-bold transition-colors",
                    isSelected ? "text-primary text-glow-primary" : "text-foreground"
                  )}>
                    {site.name}
                  </span>
                  {site.isPreferred && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/20 text-success border border-success/30">
                      <Shield className="w-3 h-3" />
                      Optimal
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>

              {/* Metrics Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={cn(
                    "text-xs font-semibold",
                    getSeismicColor(site.seismic)
                  )}>
                    {site.seismic}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Water: <span className="text-foreground font-semibold">{site.water}/10</span>
                  </span>
                </div>
              </div>

              {/* Selection Indicator Line */}
              {isSelected && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
