import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { MyanmarMap } from "@/components/dashboard/MyanmarMap";
import { SiteDetailsSidebar } from "@/components/dashboard/SiteDetailsSidebar";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { SiteSelector } from "@/components/dashboard/SiteSelector";
import { CandidateSite, candidateSites } from "@/data/smrData";

const Index = () => {
  const [selectedSite, setSelectedSite] = useState<CandidateSite | null>(
    candidateSites.find(s => s.isPreferred) || null
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Analytics */}
        <div className="w-80 border-r border-border flex flex-col bg-card/30">
          <SiteSelector 
            selectedSite={selectedSite} 
            onSiteSelect={setSelectedSite} 
          />
          <div className="flex-1 overflow-hidden">
            <AnalyticsPanel selectedSite={selectedSite} />
          </div>
        </div>

        {/* Center - Map */}
        <div className="flex-1 relative">
          <MyanmarMap 
            selectedSite={selectedSite} 
            onSiteSelect={setSelectedSite} 
          />
        </div>

        {/* Right Panel - Site Details */}
        {selectedSite && (
          <SiteDetailsSidebar 
            site={selectedSite} 
            onClose={() => setSelectedSite(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
