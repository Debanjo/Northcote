import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Navigation,
  Car,
  Bus,
  AlertTriangle,
  ExternalLink,
  Banknote,
  Clock,
} from "lucide-react";

// Yetosol office coordinates (Lagos Island)
const OFFICE = {
  lat: 6.4531,
  lng: 3.3958,
  address: "2nd Floor, 24/28 Strachan Street, off Igbosere road, Lagos Island",
};

// Haversine formula – returns km
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Lagos realistic pricing constants (2026)
const UBER_BASE = 600;           // Naira base fare
const UBER_PER_KM = 380;         // Naira per km
const UBER_PER_MIN = 45;         // Naira per minute
const SURGE_MULTIPLIER = 1.7;    // heavy traffic surge
const FUEL_PRICE_PER_LITRE = 850; // Naira
const CAR_KM_PER_LITRE = 10;     // average city consumption
const SPEED_NORMAL = 30;         // km/h in normal traffic
const SPEED_HEAVY = 15;          // km/h in heavy traffic
const ROAD_FACTOR = 1.4;         // convert straight‑line to road distance

export default function TravelModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(0);
  const [roadDistance, setRoadDistance] = useState(0);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    setAddress("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        // Reverse geocode address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          setAddress(data?.display_name || `${userLat.toFixed(4)}°, ${userLng.toFixed(4)}°`);
        } catch {
          setAddress(`${userLat.toFixed(4)}°, ${userLng.toFixed(4)}°`);
        }

        const straightDist = getDistance(userLat, userLng, OFFICE.lat, OFFICE.lng);
        setDistance(straightDist);
        setRoadDistance(straightDist * ROAD_FACTOR);
        setLoading(false);
      },
      () => {
        setError("Location access denied. Please enable location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [open]);

  // Travel times (minutes)
  const normalTime = roadDistance / SPEED_NORMAL * 60;
  const heavyTime = roadDistance / SPEED_HEAVY * 60;

  // Ride-hailing costs (Uber/Bolt)
  const uberNormalCost = Math.round(UBER_BASE + UBER_PER_KM * roadDistance + UBER_PER_MIN * normalTime);
  const uberHeavyCost = Math.round(uberNormalCost * SURGE_MULTIPLIER);

  // Public transport costs (BRT/danfo) – approximate ₦150 per 10 km
  const publicTransportCost = Math.round(roadDistance * 150);

  // Own car fuel cost
  const fuelCost = Math.round((roadDistance / CAR_KM_PER_LITRE) * FUEL_PRICE_PER_LITRE);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[85vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <DialogTitle className="text-xl font-black text-black flex items-center gap-2">
            <Navigation className="h-5 w-5 text-yellow-600" />
            From your current location
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Real‑time travel estimate from your current location.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-gray-500 text-sm">Detecting your location...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : (
            <>
              {/* Your Location */}
              <div className="bg-light-blue-50 border border-light-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-light-blue-100 p-2 rounded-lg shrink-0">
                    <MapPin className="h-5 w-5 text-light-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black">📍 Your Location</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{address}</p>
                    {userLocation && (
                      <a
                        href={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-light-blue-600 hover:underline mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy note */}
              <p className="text-xs text-gray-400 text-center -mt-2">
                ⓘ We never store your location – used only for this estimate.
              </p>

              {/* Distance overview */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Approximate Road Distance</p>
                <p className="text-3xl font-black text-black">
                  {roadDistance.toFixed(1)} km
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (straight‑line: {distance.toFixed(1)} km)
                </p>
              </div>

              {/* Travel Options */}
              <div className="space-y-4">
                <h4 className="font-bold text-black flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-yellow-600" />
                  Estimated Travel Costs
                </h4>

                {/* Ride-hailing */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-light-blue-600" />
                    <span className="font-bold text-black">Uber / Bolt</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Normal Traffic</p>
                      <p className="text-lg font-black text-black">
                        ₦{uberNormalCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> ~{Math.round(normalTime)} min
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Base ₦{UBER_BASE} + ₦{UBER_PER_KM}/km + ₦{UBER_PER_MIN}/min
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-700 font-medium mb-1">Heavy Traffic</p>
                      <p className="text-lg font-black text-black">
                        ₦{uberHeavyCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> ~{Math.round(heavyTime)} min
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {SURGE_MULTIPLIER}x surge pricing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Public Transport */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bus className="h-4 w-4 text-light-blue-600" />
                    <span className="font-bold text-black">Public Transport (BRT / Danfo)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Normal</p>
                      <p className="text-lg font-black text-black">
                        ₦{publicTransportCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        ~{Math.round(normalTime * 1.5)} min
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-700 font-medium mb-1">Traffic</p>
                      <p className="text-lg font-black text-black">
                        ₦{Math.round(publicTransportCost * 1.3).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        ~{Math.round(heavyTime * 1.5)} min
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Yetosol Office */}
              <div className="bg-light-blue-50 border border-light-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-light-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black">🏢 Our Office</p>
                    <p className="text-sm text-gray-700">{OFFICE.address}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}