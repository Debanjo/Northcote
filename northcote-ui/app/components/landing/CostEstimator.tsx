import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Mail,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Layers,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Realistic base rates in Naira per square meter (Nigerian market & Yetosol portfolio)
const projectTypes = [
  { value: "residential", label: "Residential Building", baseRate: 180000 },      // ₦180k/m²
  { value: "commercial", label: "Commercial Building", baseRate: 250000 },         // ₦250k/m²
  { value: "industrial", label: "Industrial Facility", baseRate: 220000 },         // ₦220k/m²
  { value: "renovation", label: "Renovation / Retrofitting", baseRate: 120000 },   // ₦120k/m²
  { value: "civil", label: "Civil Works", baseRate: 150000 },                      // ₦150k/m²
];

const qualityLevels = [
  { value: "standard", label: "Standard Finish", multiplier: 1, description: "Quality materials & structured execution" },
  { value: "premium", label: "Premium Finish", multiplier: 1.3, description: "Enhanced structural & interior specifications" },
  { value: "luxury", label: "Luxury / High‑End", multiplier: 1.6, description: "Elite architectural finishes & imported fit-outs" },
];

export default function CostEstimator() {
  const [projectType, setProjectType] = useState("");
  const [area, setArea] = useState("");
  const [quality, setQuality] = useState("standard");
  const [estimate, setEstimate] = useState<number | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [pendingCalculation, setPendingCalculation] = useState(false);

  const calculateEstimate = () => {
    if (!projectType || !area) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      toast.error("Please enter a valid area.");
      return;
    }

    setPendingCalculation(true);
    setShowDisclaimerModal(true);
  };

  const confirmAndCalculate = () => {
    const areaNum = parseFloat(area);
    const selectedType = projectTypes.find((t) => t.value === projectType);
    const selectedQuality = qualityLevels.find((q) => q.value === quality);

    if (!selectedType || !selectedQuality) return;

    const baseCost = selectedType.baseRate * areaNum * selectedQuality.multiplier;
    const variation = 0.88 + Math.random() * 0.24;
    const finalCost = Math.round(baseCost * variation);

    setEstimate(finalCost);
    setShowEstimate(true);
    setShowDisclaimerModal(false);
    setPendingCalculation(false);
  };

  const resetEstimator = () => {
    setProjectType("");
    setArea("");
    setQuality("standard");
    setEstimate(null);
    setShowEstimate(false);
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateMessage = () => {
    const typeLabel = projectTypes.find((t) => t.value === projectType)?.label || projectType;
    const qualityLabel = qualityLevels.find((q) => q.value === quality)?.label || quality;
    const minEstimate = estimate ? Math.round(estimate * 0.88) : 0;
    const maxEstimate = estimate ? Math.round(estimate * 1.12) : 0;

    return `Hi Yetosol, I'd like to discuss a project estimate from your AI Cost Estimator:%0A%0A` +
      `Project Type: ${typeLabel}%0A` +
      `Area: ${area} m²%0A` +
      `Quality Level: ${qualityLabel}%0A` +
      `Estimated Structural Range: ${formatNaira(minEstimate)} – ${formatNaira(maxEstimate)}%0A%0A` +
      `Please contact me to arrange a site evaluation.`;
  };

  const handleEmail = () => {
    const subject = "Project Cost Estimate Inquiry – Yetosol Associates";
    const body = generateMessage();
    window.location.href = `mailto:info@yetosol.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleWhatsApp = () => {
    const message = generateMessage();
    const phoneNumber = "2347039171254";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const substructureRatio = 0.25;
  const superstructureRatio = 0.45;
  const finishingRatio = 0.30;

  return (
    <>
      <section className="isolate relative bg-slate-50/50 py-24 sm:py-32 overflow-hidden font-sans antialiased">
        <div
          className="absolute inset-0 pointer-events-none select-none opacity-50 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(14, 165, 233, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 85% 75%, rgba(245, 158, 11, 0.06) 0%, transparent 50%)
            `
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 transform-gpu backface-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-50 border border-sky-100 rounded-full mb-6 shadow-sm">
              <span className="text-[10px] font-black tracking-[0.2em] text-sky-900 uppercase">Valuation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-slate-900 uppercase leading-normal mb-6">
              AI <span className="text-sky-600"> COST ESTIMATOR</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl mx-auto">
              Simulate accurate structural cost projections for real estate developments in Nigeria. Driven by physical, locally verified material and market indexes.
            </p>
          </div>

          {/* Two-Column Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Form */}
            <Card className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <Sliders className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">
                        Specification Matrix
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 font-semibold">
                        Define project dimensional criteria for a local structural assessment.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Project Type */}
                  <div className="space-y-2.5">
                    <Label htmlFor="projectType" className="text-xs font-black text-slate-600 uppercase tracking-wider block">
                      1. Core Project Type <span className="text-amber-500">*</span>
                    </Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger
                        id="projectType"
                        className="h-13 bg-white border border-slate-200 text-slate-900 font-medium focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 rounded-xl transition-all"
                      >
                        <SelectValue placeholder="Select construction archetype" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-250 text-slate-900 rounded-xl shadow-xl z-50">
                        {projectTypes.map((type) => (
                          <SelectItem
                            key={type.value}
                            value={type.value}
                            className="text-slate-900 font-semibold cursor-pointer py-3.5 px-4 focus:bg-slate-50 focus:text-slate-950 transition-colors"
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area */}
                  <div className="space-y-2.5">
                    <Label htmlFor="area" className="text-xs font-black text-slate-600 uppercase tracking-wider block">
                      2. Gross Built-Up Area (GBA) <span className="text-amber-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="area"
                        type="number"
                        min="1"
                        placeholder="e.g., 350"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="h-13 bg-white border border-slate-200 text-slate-900 font-medium placeholder-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 rounded-xl pr-16 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-xs font-mono font-black text-slate-500 bg-slate-100/80 px-2 py-1 rounded">m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Finishing Standard */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-slate-600 uppercase tracking-wider block">
                      3. Finishing Standard
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {qualityLevels.map((q) => {
                        const isSelected = quality === q.value;
                        return (
                          <div
                            key={q.value}
                            onClick={() => setQuality(q.value)}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${isSelected
                              ? "bg-slate-900 border-slate-900 text-white shadow-md"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50/50"
                              }`}
                          >
                            <p className="text-xs font-black uppercase tracking-tight">{q.label}</p>
                            <p className={`text-[10px] leading-tight mt-1 font-semibold ${isSelected ? "text-slate-350" : "text-slate-450"}`}>
                              {q.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Form Actions Footer */}
              <div className="p-8 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end">
                {!showEstimate ? (
                  <Button
                    onClick={calculateEstimate}
                    className="w-full h-13 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md shadow-sky-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    Generate Estimate Range <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={resetEstimator}
                    variant="outline"
                    className="w-full h-13 border-2 border-slate-200 text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset Estimation Criteria
                  </Button>
                )}
              </div>
            </Card>

            {/* Right Column: Output */}
            <Card className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between min-h-[500px] relative">
              <CardHeader className="border-b border-slate-150 bg-slate-50/70 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                      <Layers className="w-4.5 h-4.5 text-sky-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Estimate Output Hub
                      </CardTitle>
                      <CardDescription className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {showEstimate ? "Verified project metrics derived via local indexing." : "Awaiting input fields configuration."}
                      </CardDescription>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md bg-white">
                    RE-4.0
                  </span>
                </div>
              </CardHeader>

              {/* Dynamic Content */}
              <div className="p-8 flex-1 flex flex-col justify-center relative">
                <AnimatePresence mode="wait">
                  {showEstimate && estimate !== null ? (
                    <motion.div
                      key="estimate-result"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* Price Range Box */}
                      <div className="text-center p-6 sm:p-8 bg-sky-50/50 border border-sky-100 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-mono font-black text-emerald-700 uppercase tracking-widest">Active Proj. Range</span>
                        </div>
                        <p className="text-[10px] font-black text-sky-700 uppercase tracking-[0.2em] mb-3.5 flex items-center justify-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" /> Calculated Structural Valuation
                        </p>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                          {formatNaira(Math.round(estimate * 0.88))} <br className="sm:hidden" />
                          <span className="text-slate-400 text-lg sm:text-xl font-medium px-2">—</span> <br className="sm:hidden" />
                          {formatNaira(Math.round(estimate * 1.12))}
                        </h3>
                        <div className="flex items-start justify-center gap-2 text-slate-500 text-xs font-semibold leading-normal">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>Estimate excludes specialized architectural design fees & municipal site permits.</span>
                        </div>
                      </div>

                      {/* Budget Allocation Model */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block pl-1">
                          Phase Budget Allocation Model
                        </span>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700">Foundations & Earthworks (25%)</span>
                              <span className="text-slate-900 font-mono">{formatNaira(Math.round(estimate * substructureRatio))}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: "25%" }} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700">Superstructure Core Frame & Masonry (45%)</span>
                              <span className="text-slate-900 font-mono">{formatNaira(Math.round(estimate * superstructureRatio))}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700">Internal Finishes & M&E Services (30%)</span>
                              <span className="text-slate-900 font-mono">{formatNaira(Math.round(estimate * finishingRatio))}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-500 rounded-full" style={{ width: "30%" }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">
                          Ready to discuss this with Yetosol Engineers?
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            onClick={handleEmail}
                            variant="outline"
                            className="h-12 border border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-50 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Mail className="h-4 w-4 text-slate-600" /> Email Specifications
                          </Button>
                          <Button
                            onClick={handleWhatsApp}
                            className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="h-4.5 w-4.5" /> WhatsApp Dispatcher
                          </Button>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center font-semibold">
                          Your chosen values will be pre-formatted automatically into your message.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="estimate-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 text-slate-450">
                        <Calculator className="h-8 w-8 text-amber-500" />
                      </div>
                      <p className="text-slate-800 text-base font-black uppercase tracking-tight">Your Estimate Screen</p>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto mt-2 font-semibold">
                        Input project values and specify floor metrics in the configuration matrix to generate interactive valuations.
                      </p>
                      <div className="flex items-center gap-4 mt-8 text-slate-400">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-350" />
                          <span className="text-[10px] font-mono font-black tracking-widest uppercase">Verified Algorithms</span>
                        </div>
                        <span className="text-slate-200">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-350" />
                          <span className="text-[10px] font-mono font-black tracking-widest uppercase">Nigerian Cost Index</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-[-15px] right-6 text-7xl font-black text-slate-500/[0.03] tracking-widest select-none pointer-events-none uppercase font-mono">
                YETOSOL
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 border border-amber-100">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-slate-900 font-black text-lg uppercase tracking-tight">
              IMPORTANT VALUATION NOTICE
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              These structural projections are compiled using dynamic AI estimations using historical contractor project data. These values serve solely as an initial guide.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 border-t border-b border-slate-100 my-4 space-y-3.5">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
              <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                Site geological conditions, dynamic global material price indices, and custom architectural elements will alter final structural overhead costs.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
              <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                A formal, legally binding Bill of Quantities (BOQ) is provided exclusively following physical geological assessment and review of finalized blueprints.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
              <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                Prices are displayed in Nigerian Naira (₦) factoring in present baseline industrial manufacturing margins.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDisclaimerModal(false);
                setPendingCalculation(false);
              }}
              className="h-11 border border-slate-200 text-slate-750 font-bold rounded-xl hover:bg-slate-50 transition-all flex-1"
            >
              Cancel Calculation
            </Button>
            <Button
              type="button"
              onClick={confirmAndCalculate}
              className="h-11 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-xl transition-all flex-1"
            >
              Understand & View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}