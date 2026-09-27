import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Factory,
  Package,
  Wrench,
  Boxes,
  HardHat,
  Info,
  Mail,
  MessageCircle,
  X,
  ArrowRight,
  Activity,
  Globe,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const BASE_MARKET_INDEX = [
  { id: "cement", name: "Cement (50kg bag)", basePrice: 10000, price: 10000, unit: "bag", icon: Package, volatility: 0.015, historicalTrend: 12.4 },
  { id: "steel", name: "Steel Rod (12mm, per ton)", basePrice: 1060000, price: 1060000, unit: "ton", icon: Wrench, volatility: 0.02, historicalTrend: 24.7 },
  { id: "sand", name: "Sharp Sand (20t tipper)", basePrice: 97500, price: 97500, unit: "load", icon: Boxes, volatility: 0.03, historicalTrend: 116.7 },
  { id: "granite", name: "Granite (20t tipper)", basePrice: 375000, price: 375000, unit: "load", icon: HardHat, volatility: 0.012, historicalTrend: 108.3 },
];

export default function MaterialsPriceTracker() {
  const [prices, setPrices] = useState(BASE_MARKET_INDEX);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [liveDelta, setLiveDelta] = useState<Record<string, number>>({});

  const fetchLatestMarketPrices = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 750));
    const updated = BASE_MARKET_INDEX.map((item) => {
      const randomVariance = (Math.random() * 2 - 1) * item.volatility;
      const fluctuatedPrice = Math.round(item.basePrice * (1 + randomVariance));
      setLiveDelta((prev) => ({ ...prev, [item.id]: randomVariance * 100 }));
      return { ...item, price: fluctuatedPrice };
    });
    setPrices(updated);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLatestMarketPrices();
  }, [fetchLatestMarketPrices]);

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const generateMessage = () => {
    const priceList = prices.map((item) => `${item.name}: ${formatNaira(item.price)}/${item.unit}`).join("%0A");
    return (
      `Hi Yetosol, I would like to get a detailed quotation for construction materials.%0A%0A` +
      `Lagos Live Reference Rates I observed:%0A${priceList}%0A%0A` +
      `Please provide a tailored delivery breakdown.`
    );
  };

  const handleEmail = () => {
    const subject = "Construction Materials Quotation Inquiry – Yetosol";
    const body = generateMessage();
    window.location.href = `mailto:info@yetosol.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setModalOpen(false);
  };

  const handleWhatsApp = () => {
    const message = generateMessage();
    const phoneNumber = "2347039171254";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    setModalOpen(false);
  };

  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden font-sans antialiased">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-[0.02] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 border border-sky-100 rounded-full mb-6 shadow-sm">
            <Activity className="h-3.5 w-3.5 text-sky-650 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] text-sky-900 uppercase">Live Commodity Feed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-6">
            <span className="text-sky-650">MATERIAL PRICE SURVEYS</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl mx-auto">
            Monitoring active retail building supply indices across prominent trade hubs in Lagos mainland markets.
          </p>
          <div className="mt-6 inline-flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-2xl shadow-sm">
            <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Dynamic Index Notice</p>
              <p className="text-xs text-slate-500 font-semibold leading-normal">
                These rates represent localized baseline market references updated continuously via simulation. Actual delivery quotes fluctuate depending on bulk quantities, transit diesel surcharges, and direct manufacturer site deals.
              </p>
            </div>
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {prices.map((item) => {
            const Icon = item.icon;
            const priceVal = item.price || item.basePrice;
            const currentDrift = liveDelta[item.id] || 0;
            const isUpward = currentDrift >= 0;
            return (
              <Card key={item.id} className="bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-[0_12px_25px_rgba(0,0,0,0.03)] transition-all overflow-hidden flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <Icon className="h-5 w-5 text-sky-600" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`h-6 px-2.5 rounded-full font-mono font-bold text-[10px] flex items-center gap-1 border ${isUpward
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                    >
                      {isUpward ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-rose-600" />}
                      {isUpward ? "+" : ""}
                      {currentDrift.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{item.unit} rate</p>
                    <h3 className="font-black text-sm text-slate-700 leading-tight uppercase truncate">{item.name}</h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {isRefreshing ? (
                        <span className="inline-block w-28 h-7 bg-slate-100 animate-pulse rounded" />
                      ) : (
                        formatNaira(priceVal)
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Reference spot price</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Data status bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:px-6 mb-12">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-550">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>
              {lastUpdated ? (
                <>
                  Latest Market API Call: <span className="text-slate-800 font-black">{lastUpdated.toLocaleDateString()}</span> at <span className="text-slate-800 font-black">{lastUpdated.toLocaleTimeString()}</span>
                </>
              ) : (
                "Connecting to market matrix..."
              )}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLatestMarketPrices}
            disabled={isRefreshing}
            className="h-9 px-4 border border-slate-200 bg-white text-slate-750 hover:text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-sky-600 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Calling API..." : "Refresh Live Index"}
          </Button>
        </div>

        {/* CTA Banner */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="bg-sky-50 border border-sky-100 p-3 rounded-2xl shrink-0 hidden sm:block">
                  <Factory className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Secure Project Estimations</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1 max-w-sm">
                    Lock in structured wholesale rates directly from verified distributor yards to bypass intra-day retail volatility.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-950 text-white font-black text-xs uppercase tracking-wider h-12 px-6 rounded-xl transition-all w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 shadow-md shadow-slate-900/5"
              >
                Request Custom Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-sky-600" />
            </div>
            <DialogTitle className="text-slate-900 font-black text-lg uppercase tracking-tight">Get an Exact Material Quote</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              Our consulting engineers will compute bulk transportation margins and coordinate with suppliers to build an optimized cost structure for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 border-t border-b border-slate-100 my-4 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150">
              <p className="text-xs text-slate-650 font-bold leading-normal mb-4">
                Choose how you would like our estimating team to deliver your comprehensive Bill of Quantities (BOQ):
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="h-11 border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4 text-slate-500" /> Email Dispatch
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center font-bold">
              PREFER VOICE DISPATCH? CALL US: <span className="text-slate-800 font-mono">+234 703 917 1254</span>
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="h-11 border border-slate-200 text-slate-700 hover:bg-slate-50 font-black text-xs uppercase tracking-wider rounded-xl px-5 transition-all flex items-center gap-1.5"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}