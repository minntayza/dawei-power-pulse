import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { candidateSites, loadCenters, CandidateSite, yangonHub } from "@/data/smrData";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom site marker (red)
const createSiteIcon = (isSelected: boolean, isPreferred: boolean) => L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: ${isSelected ? '24px' : '20px'};
      height: ${isSelected ? '24px' : '20px'};
      background: ${isPreferred ? '#f59e0b' : '#ef4444'};
      border: 3px solid ${isSelected ? '#f59e0b' : 'rgba(255,255,255,0.8)'};
      border-radius: 50%;
      box-shadow: 0 0 ${isSelected ? '25px' : '15px'} ${isSelected ? 'rgba(245,158,11,0.8)' : (isPreferred ? 'rgba(245,158,11,0.6)' : 'rgba(239,68,68,0.6)')};
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [isSelected ? 24 : 20, isSelected ? 24 : 20],
  iconAnchor: [isSelected ? 12 : 10, isSelected ? 12 : 10],
});

// Custom city marker (blue)
const createCityIcon = (isPrimary: boolean) => L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: ${isPrimary ? '22px' : '16px'};
      height: ${isPrimary ? '22px' : '16px'};
      background: ${isPrimary ? '#3b82f6' : '#60a5fa'};
      border: 2px solid rgba(255,255,255,0.7);
      border-radius: 50%;
      box-shadow: 0 0 ${isPrimary ? '20px' : '10px'} ${isPrimary ? 'rgba(59,130,246,0.7)' : 'rgba(96,165,250,0.5)'};
    "></div>
  `,
  iconSize: [isPrimary ? 22 : 16, isPrimary ? 22 : 16],
  iconAnchor: [isPrimary ? 11 : 8, isPrimary ? 11 : 8],
});

// Map bounds handler
function MapController({ selectedSite }: { selectedSite: CandidateSite | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedSite) {
      map.flyTo([selectedSite.lat, selectedSite.lng], 8, { duration: 1 });
    }
  }, [selectedSite, map]);
  
  return null;
}

interface MyanmarMapProps {
  selectedSite: CandidateSite | null;
  onSiteSelect: (site: CandidateSite) => void;
}

export function MyanmarMap({ selectedSite, onSiteSelect }: MyanmarMapProps) {
  const center: [number, number] = [18.5, 96.5];

  // Transmission line from selected site to Yangon
  const transmissionLine = selectedSite ? [
    [selectedSite.lat, selectedSite.lng] as [number, number],
    [yangonHub.lat, yangonHub.lng] as [number, number],
  ] : [];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={6}
        className="w-full h-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController selectedSite={selectedSite} />

        {/* Transmission Line */}
        {selectedSite && (
          <Polyline
            positions={transmissionLine}
            pathOptions={{
              color: "#f59e0b",
              weight: 4,
              opacity: 0.8,
              dashArray: "10, 10",
              className: "transmission-pulse",
            }}
          />
        )}

        {/* Load Centers (Cities) */}
        {loadCenters.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createCityIcon(city.priority === 1)}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-foreground">{city.name}</strong>
                <br />
                <span className="text-muted-foreground">
                  Demand: {city.demandMWh.toLocaleString()} MWh/day
                </span>
                <br />
                <span className="text-muted-foreground">
                  Priority: #{city.priority}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Candidate Sites */}
        {candidateSites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={createSiteIcon(selectedSite?.id === site.id, site.isPreferred || false)}
            eventHandlers={{
              click: () => onSiteSelect(site),
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-foreground">{site.name}</strong>
                {site.isPreferred && (
                  <span className="ml-2 px-2 py-0.5 bg-success/20 text-success text-xs rounded-full">
                    Preferred
                  </span>
                )}
                <br />
                <span className="text-muted-foreground">
                  Water: {site.water}/10 | Seismic: {site.seismic}
                </span>
                <br />
                <span className="text-xs text-primary cursor-pointer">
                  Click to view details →
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 dashboard-card p-3 z-[1000]">
        <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-amber border-2 border-foreground/50" />
            <span className="text-muted-foreground">Preferred Site</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-red border-2 border-foreground/50" />
            <span className="text-muted-foreground">Candidate Site</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-blue border-2 border-foreground/50" />
            <span className="text-muted-foreground">Load Center</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-energy-amber" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Transmission</span>
          </div>
        </div>
      </div>

      {/* Site Selection Prompt */}
      {!selectedSite && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 dashboard-card px-4 py-2 z-[1000]">
          <p className="text-sm text-muted-foreground">
            Click on a <span className="text-energy-red font-medium">red marker</span> to analyze a candidate site
          </p>
        </div>
      )}
    </div>
  );
}
