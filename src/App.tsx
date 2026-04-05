import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Navigation, 
  Info, 
  ChevronRight, 
  Star, 
  Gem, 
  Clock, 
  Plane,
  Menu,
  X,
  ChevronLeft,
  Camera,
  Map as MapIcon
} from 'lucide-react';
import { itineraryData, ItinerarySegment, Location } from './types';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icons for different location types
const getIcon = (loc: Location, isActive: boolean) => {
  const color = isActive ? '#ef4444' : (loc.type === 'stay' ? '#3b82f6' : loc.type === 'hidden-gem' ? '#10b981' : '#f59e0b');
  const stayLabel = loc.stayDuration ? `<div class="stay-badge">${loc.stayDuration}</div>` : '';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-container">
        <div class="marker-dot" style="background-color: ${color};"></div>
        ${stayLabel}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to handle map view changes
function ChangeView({ center, zoom, onMapClick }: { center: [number, number], zoom: number, onMapClick: () => void }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);

  useEffect(() => {
    map.on('click', (e) => {
      // Only close if we didn't click a marker or polyline
      // Leaflet events bubble, but we can check if the target is the map itself
      if (e.originalEvent.target === map.getContainer() || (e.originalEvent.target as HTMLElement).classList.contains('leaflet-container')) {
        onMapClick();
      }
    });
    return () => {
      map.off('click');
    };
  }, [map, onMapClick]);

  return null;
}

// Custom Zoom Controls Component
function ZoomControls() {
  const map = useMap();
  return (
    <div className="flex flex-col gap-2">
      <button 
        onClick={() => map.zoomIn()}
        className="p-2 bg-white hover:bg-slate-100 rounded-lg shadow-lg border border-slate-200 transition-colors text-slate-600"
        title="Zoom In"
      >
        <Navigation size={20} className="rotate-45" />
      </button>
      <button 
        onClick={() => map.zoomOut()}
        className="p-2 bg-white hover:bg-slate-100 rounded-lg shadow-lg border border-slate-200 transition-colors text-slate-600"
        title="Zoom Out"
      >
        <Navigation size={20} className="rotate-[225deg]" />
      </button>
    </div>
  );
}

// Component to add arrows to the polyline
function PolylineDecorator({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length < 2) return;

    const polyline = L.polyline(points);
    // @ts-ignore
    const decorator = L.polylineDecorator(polyline, {
      patterns: [
        { 
          offset: '10%', 
          repeat: '20%', 
          symbol: L.Symbol.arrowHead({ 
            pixelSize: 10, 
            polygon: false, 
            pathOptions: { stroke: true, color: '#3b82f6', weight: 2, opacity: 0.8 } 
          }) 
        }
      ]
    }).addTo(map);

    return () => {
      map.removeLayer(decorator);
    };
  }, [map, points]);

  return null;
}

// Component to show distances between points
function DistanceLabels({ allLocations }: { allLocations: Location[] }) {
  return (
    <>
      {allLocations.map((loc, index) => {
        if (index === 0 || !loc.distanceFromPrevious) return null;
        
        const p1 = allLocations[index - 1];
        const p2 = loc;
        
        if (!p1 || !p2) return null;

        const midLat = (p1.lat + p2.lat) / 2;
        const midLng = (p1.lng + p2.lng) / 2;

        return (
          <Marker 
            key={`dist-${loc.id}`}
            position={[midLat, midLng]}
            icon={L.divIcon({
              className: 'distance-label',
              html: `<span>${loc.distanceFromPrevious}</span>`,
              iconSize: [60, 20],
              iconAnchor: [30, 10]
            })}
            interactive={false}
          />
        );
      })}
    </>
  );
}

// Fallback image for broken links
const FALLBACK_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Aerial_view_of_Augusta_Street%2C_Lisbon_%2850644280948%29.jpg";

// Image Carousel Component for Popups
function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [errorImages, setErrorImages] = useState<Record<number, boolean>>({});

  if (!images || images.length === 0) return null;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    setErrorImages(prev => ({ ...prev, [index]: true }));
  };

  const currentImage = errorImages[currentIndex] ? FALLBACK_IMAGE : images[currentIndex];

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-xl group bg-slate-100">
      {!loadedImages[currentIndex] && !errorImages[currentIndex] && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: loadedImages[currentIndex] || errorImages[currentIndex] ? 1 : 0 }}
          exit={{ opacity: 0 }}
          onLoad={() => handleImageLoad(currentIndex)}
          onError={() => handleImageError(currentIndex)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(itineraryData[0].id);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<{ type: 'location' | 'route', id: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mapStyle, setMapStyle] = useState<'voyager' | 'terrain'>('voyager');
  const [roadLegs, setRoadLegs] = useState<[number, number][][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Image Caching & Preloading
  useEffect(() => {
    const allImages = Array.from(new Set([
      FALLBACK_IMAGE,
      ...itineraryData.flatMap(s => s.routeImages || []),
      ...itineraryData.flatMap(s => s.locations.flatMap(l => l.images || []))
    ]));
    
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    // Preload in batches to avoid overwhelming the browser
    const batchSize = 5;
    const preloadAll = async () => {
      for (let i = 0; i < allImages.length; i += batchSize) {
        const batch = allImages.slice(i, i + batchSize);
        await Promise.allSettled(batch.map(preloadImage));
      }
    };

    preloadAll();
  }, []);

  const selectedSegment = useMemo(() => 
    itineraryData.find(s => s.id === selectedSegmentId) || itineraryData[0]
  , [selectedSegmentId]);

  const mapCenter = useMemo((): [number, number] => {
    if (selectedLocationId) {
      const loc = selectedSegment.locations.find(l => l.id === selectedLocationId);
      if (loc) return [loc.lat, loc.lng];
    }
    if (selectedSegment.locations.length > 0) {
      return [selectedSegment.locations[0].lat, selectedSegment.locations[0].lng];
    }
    return [39.5, -8.0]; // Default Portugal center
  }, [selectedSegment, selectedLocationId]);

  const mapZoom = useMemo(() => selectedLocationId ? 12 : 8, [selectedLocationId]);

  const allLocations = useMemo(() => itineraryData.flatMap(s => s.locations), []);

  // Fetch road-following route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      if (allLocations.length < 2) return;
      
      setIsLoadingRoute(true);
      try {
        // OSRM expects lng,lat
        const coords = allLocations.map(l => `${l.lng},${l.lat}`).join(';');
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`
        );
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          // Extract points for each leg
          const legs = data.routes[0].legs.map((leg: any) => {
            return leg.steps.flatMap((step: any) => 
              step.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])
            );
          });
          setRoadLegs(legs);
        } else {
          // Fallback to straight line legs
          const fallbackLegs = [];
          for (let i = 0; i < allLocations.length - 1; i++) {
            fallbackLegs.push([
              [allLocations[i].lat, allLocations[i].lng] as [number, number],
              [allLocations[i+1].lat, allLocations[i+1].lng] as [number, number]
            ]);
          }
          setRoadLegs(fallbackLegs);
        }
      } catch (error) {
        console.error('Error fetching road route:', error);
        const fallbackLegs = [];
        for (let i = 0; i < allLocations.length - 1; i++) {
          fallbackLegs.push([
            [allLocations[i].lat, allLocations[i].lng] as [number, number],
            [allLocations[i+1].lat, allLocations[i+1].lng] as [number, number]
          ]);
        }
        setRoadLegs(fallbackLegs);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [allLocations]);

  const highlightedPoints = useMemo(() => {
    if (roadLegs.length === 0) return [];

    // If a specific location is selected, highlight the leg leading to it
    if (selectedLocationId) {
      const locIndex = allLocations.findIndex(l => l.id === selectedLocationId);
      if (locIndex > 0) {
        return roadLegs[locIndex - 1];
      }
    }

    // If a segment is selected, highlight all legs within that segment
    const segmentLocIds = selectedSegment.locations.map(l => l.id);
    const firstLocIndex = allLocations.findIndex(l => l.id === segmentLocIds[0]);
    const lastLocIndex = allLocations.findIndex(l => l.id === segmentLocIds[segmentLocIds.length - 1]);

    if (firstLocIndex === -1) return [];

    const points: [number, number][] = [];
    // Include legs between locations in this segment
    for (let i = firstLocIndex; i < lastLocIndex; i++) {
      if (roadLegs[i]) {
        points.push(...roadLegs[i]);
      }
    }
    // Also include the leg leading to the first location of this segment (if not the very first)
    if (firstLocIndex > 0 && roadLegs[firstLocIndex - 1]) {
      points.unshift(...roadLegs[firstLocIndex - 1]);
    }

    return points;
  }, [roadLegs, selectedSegment, selectedLocationId, allLocations]);

  const roadPoints = useMemo(() => roadLegs.flat(), [roadLegs]);

  const handleLocationClick = (locId: string) => {
    setSelectedLocationId(locId);
    setActivePopup({ type: 'location', id: locId });
  };

  const handleSegmentClick = (segId: string) => {
    setSelectedSegmentId(segId);
    setSelectedLocationId(null);
    setActivePopup(null);
  };

  const handleRouteClick = (segId: string) => {
    setSelectedSegmentId(segId);
    setSelectedLocationId(null);
    setActivePopup({ type: 'route', id: segId });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-[1001] p-2 bg-white rounded-full shadow-lg lg:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Left Panel - Itinerary */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? '400px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className="relative z-10 flex flex-col h-full bg-white border-r border-slate-200 shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Navigation className="text-blue-600" size={24} />
            Portugal Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">Interactive Road Trip Itinerary</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {itineraryData.map((segment) => (
            <div 
              key={segment.id}
              className={`group cursor-pointer rounded-xl border transition-all duration-300 ${
                selectedSegmentId === segment.id 
                  ? 'border-blue-500 bg-blue-50/30 shadow-sm' 
                  : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
              onClick={() => handleSegmentClick(segment.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                    <Calendar size={12} />
                    {segment.dates}
                  </span>
                  {segment.distance && (
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                      {segment.distance}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {segment.title}
                </h3>
                
                {selectedSegmentId === segment.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    {segment.strategy && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <p className="text-xs text-amber-800 leading-relaxed italic">
                          <span className="font-bold">Strategy:</span> {segment.strategy}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {segment.locations.map((loc) => (
                        <div 
                          key={loc.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocationClick(loc.id);
                          }}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedLocationId === loc.id 
                              ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-400/20' 
                              : 'bg-white/50 border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 p-1.5 rounded-md ${
                              loc.type === 'stay' ? 'bg-blue-100 text-blue-600' :
                              loc.type === 'hidden-gem' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-amber-100 text-amber-600'
                            }`}>
                              {loc.type === 'stay' ? <MapPin size={14} /> :
                               loc.type === 'hidden-gem' ? <Gem size={14} /> :
                               <Star size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <h4 className="text-sm font-bold text-slate-800">{loc.name}</h4>
                                  {loc.distanceFromPrevious && (
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                      <Navigation size={8} />
                                      {loc.distanceFromPrevious} from previous
                                    </span>
                                  )}
                                </div>
                                {loc.stayDuration && (
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                    {loc.stayDuration}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {loc.description}
                              </p>
                              {selectedLocationId === loc.id && loc.tips && (
                                <ul className="mt-2 space-y-1">
                                  {loc.tips.map((tip, i) => (
                                    <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                      <div className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {segment.notes && (
                      <div className="pt-2 border-t border-slate-100">
                        {segment.notes.map((note, i) => (
                          <p key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5 py-0.5">
                            <Info size={10} />
                            {note}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
          <span>Portugal Itinerary 2026</span>
          <div className="flex gap-2">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Stay</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Stop</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Gem</span>
          </div>
        </div>
      </motion.aside>

      {/* Right Panel - Map */}
      <main className="flex-1 relative h-full">
        <MapContainer 
          center={[39.5, -8.0]} 
          zoom={7} 
          className="h-full w-full z-0"
          zoomControl={false}
        >
          {mapStyle === 'voyager' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          )}
          
          <ChangeView 
            center={mapCenter} 
            zoom={mapZoom} 
            onMapClick={() => setActivePopup(null)} 
          />
          
          {/* Route Line */}
          <Polyline 
            positions={roadPoints.length > 0 ? roadPoints : allLocations.map(l => [l.lat, l.lng])} 
            color="#3b82f6" 
            weight={4} 
            opacity={0.3}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                handleRouteClick(selectedSegmentId);
              }
            }}
          />

          {/* Highlighted Segment/Leg */}
          {highlightedPoints.length > 0 && (
            <Polyline 
              positions={highlightedPoints} 
              color="#2563eb" 
              weight={6} 
              opacity={0.9}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  handleRouteClick(selectedSegmentId);
                }
              }}
            />
          )}
          
          {/* Arrows on the route */}
          <PolylineDecorator points={highlightedPoints.length > 0 ? highlightedPoints : (roadPoints.length > 0 ? roadPoints : allLocations.map(l => [l.lat, l.lng]))} />
          
          {/* Distance Labels */}
          <DistanceLabels allLocations={allLocations} />

          {/* Markers */}
          {allLocations.map((loc) => (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]}
              icon={getIcon(loc, selectedLocationId === loc.id)}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  const segment = itineraryData.find(s => s.locations.some(l => l.id === loc.id));
                  if (segment) {
                    setSelectedSegmentId(segment.id);
                    handleLocationClick(loc.id);
                  }
                }
              }}
            />
          ))}

          <div className="absolute bottom-24 right-6 z-[1000]">
            <ZoomControls />
          </div>
        </MapContainer>

        {/* Exciting Popup Overlay */}
        <AnimatePresence>
          {activePopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="absolute top-6 right-6 z-[2000] w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <button 
                onClick={() => setActivePopup(null)}
                className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-full shadow-md backdrop-blur-sm transition-colors"
              >
                <X size={18} />
              </button>

              {activePopup.type === 'location' ? (() => {
                const loc = allLocations.find(l => l.id === activePopup.id);
                if (!loc) return null;
                return (
                  <>
                    <ImageCarousel images={loc.images || []} />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`p-1.5 rounded-lg ${
                          loc.type === 'stay' ? 'bg-blue-100 text-blue-600' :
                          loc.type === 'hidden-gem' ? 'bg-emerald-100 text-emerald-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {loc.type === 'stay' ? <MapPin size={16} /> :
                           loc.type === 'hidden-gem' ? <Gem size={16} /> :
                           <Star size={16} />}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{loc.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {loc.description}
                      </p>
                      {loc.tips && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Info size={12} /> Local Tips
                          </h4>
                          <ul className="space-y-1">
                            {loc.tips.map((tip, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                );
              })() : (() => {
                const seg = itineraryData.find(s => s.id === activePopup.id);
                if (!seg) return null;
                return (
                  <>
                    <ImageCarousel images={seg.routeImages || []} />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                          <MapIcon size={16} />
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{seg.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                          {seg.distance}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Navigation size={12} /> {seg.routeInfo}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "Experience the breathtaking beauty of the Portuguese landscape along this scenic route."
                      </p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Overlay Controls */}
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2 items-end">
          <div className="bg-white p-1 rounded-xl shadow-2xl border border-slate-200 flex flex-col gap-2">
             <button 
              onClick={() => setMapStyle(mapStyle === 'voyager' ? 'terrain' : 'voyager')}
              className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                mapStyle === 'terrain' ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Toggle Terrain"
            >
              <MapPin size={18} />
              <span className="text-[10px] font-bold pr-1 uppercase tracking-wider">{mapStyle === 'terrain' ? 'Terrain' : 'Standard'}</span>
            </button>
          </div>
          {isLoadingRoute && (
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calculating Road Route...</span>
            </div>
          )}
        </div>

        {/* Current Location Indicator Overlay */}
        <AnimatePresence>
          {selectedLocationId && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 pointer-events-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {allLocations.find(l => l.id === selectedLocationId)?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedSegment.title}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedLocationId(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .marker-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .marker-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        .stay-badge {
          position: absolute;
          top: -20px;
          white-space: nowrap;
          background: #3b82f6;
          color: white;
          font-size: 9px;
          font-weight: bold;
          padding: 1px 4px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .distance-label span {
          background: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
          color: #64748b;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
