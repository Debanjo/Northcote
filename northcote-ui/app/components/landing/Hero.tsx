// northcote-ui/app/components/landing/Hero.tsx
import { useState, useEffect, useRef } from "react";
import { Play, Check, ChevronLeft, ChevronRight, Activity, Star, Zap, Shield, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { SwipeableVideoModal } from "@/components/SwipeableVideoModal";

const slides = [
  {
    badge: "YETOSOL • CIVIL ENGINEERING",
    headlineFirst: "We Build",
    headlineHighlight: "Robust",
    headlineLast: "Infrastructure",
    description:
      "Precision civil works, heavy foundations, and structural engineering built to stand for generations.",
    primaryCta: "Request Project Tender",
    secondaryCta: "View Blueprint Specs",
    salesVal: "42+",
    growth: "Completed Projects",
    metricLabel: "Major Civil Landmarks",
    claudiaImg: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867447/kitchen1_kpkpwk.jpg",
    claudiaTag: "Structural Supervision",
    multiplierText: "100%",
    multiplierSub: "Strict adherence to safety codes and state regulatory standards.",
    accent: "from-sky-500 to-blue-600",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    badge: "YETOSOL • STRUCTURAL DESIGN",
    headlineFirst: "Flawless",
    headlineHighlight: "Structural",
    headlineLast: "Blueprints",
    description:
      "High-performance load calculations, advanced BIM modeling, and site-ready construction documents.",
    primaryCta: "Consult Our Engineers",
    secondaryCta: "Read Case Studies",
    salesVal: "0.0mm",
    growth: "Deflection Rate",
    metricLabel: "Precision Calculations",
    claudiaImg: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867443/hero2_ouneoa.jpg",
    claudiaTag: "Structural Analytics",
    multiplierText: "Zero Error",
    multiplierSub: "Uncompromising spatial alignment and load balancing on site.",
    accent: "from-violet-500 to-purple-600",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    badge: "YETOSOL • ASSET MANAGEMENT",
    headlineFirst: "Sustaining",
    headlineHighlight: "Asset",
    headlineLast: "Longevity",
    description:
      "Premium facilities management and preventive maintenance schedules to safeguard structural integrity.",
    primaryCta: "Get Maintenance Quote",
    secondaryCta: "Explore Managed Properties",
    salesVal: "25k+",
    growth: "Managed Sqm",
    metricLabel: "Premium Facilities",
    claudiaImg: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867443/hero3_xl8nww.jpg",
    claudiaTag: "Facilities Lead",
    multiplierText: "20+ Yrs",
    multiplierSub: "Ensuring concrete, MEP, and aesthetic longevity effortlessly.",
    accent: "from-amber-500 to-orange-500",
    icon: <Award className="h-4 w-4" />,
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: reviews, loading: reviewsLoading } = useGoogleReviews();

  // Auto‑advance slider with pause on hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[activeIndex];

  return (
    <>
      <section
        className="relative bg-white text-black overflow-hidden min-h-screen flex items-center select-none font-['Inter']"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ---------- Refined dynamic background ---------- */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,165,233,0.06),transparent_70%),radial-gradient(ellipse_at_70%_80%,rgba(234,179,8,0.04),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-70 pointer-events-none" />

        {/* Soft floating orbs for depth */}
        <div className="absolute top-[5%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-sky-100/30 rounded-full filter blur-[120px] pointer-events-none animate-[float_15s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-yellow-50/40 rounded-full filter blur-[130px] pointer-events-none animate-[float_18s_ease-in-out_infinite_reverse]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 xl:px-12 w-full z-10 py-16 lg:py-20">

          {/* ==================== HERO TEXT SLIDER ==================== */}
          <div className="relative overflow-hidden w-full max-w-4xl mx-auto mb-10 min-h-[240px] sm:min-h-[260px] md:min-h-[280px] flex items-center justify-center">
            {slides.map((slide, index) => {
              const isCurrent = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + slides.length) % slides.length;
              const isNext = index === (activeIndex + 1) % slides.length;
              return (
                <div
                  key={index}
                  className={cn(
                    "absolute w-full flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isCurrent
                      ? "opacity-100 translate-x-0 scale-100 blur-0"
                      : isPrev
                        ? "opacity-0 -translate-x-24 scale-95 blur-sm"
                        : isNext
                          ? "opacity-0 translate-x-24 scale-95 blur-sm"
                          : "opacity-0 translate-x-0 scale-90 blur-md pointer-events-none"
                  )}
                >
                  {/* Dynamic pill badge */}
                  <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-sky-500/5 px-4 py-1.5 rounded-full mb-6 transition-all duration-500">
                    <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-sky-900 uppercase">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Enhanced typography */}
                  <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] uppercase max-w-3xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-700">
                    {slide.headlineFirst}{" "}
                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                      {slide.headlineHighlight}
                    </span>{" "}
                    {slide.headlineLast}
                  </h1>

                  <p className="text-sm sm:text-base text-gray-500 max-w-lg mt-5 leading-relaxed font-medium text-balance">
                    {slide.description}
                  </p>
                </div>
              );
            })}

            {/* Navigation arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden sm:flex justify-between px-0 sm:px-2 pointer-events-none z-20">
              <button
                onClick={prevSlide}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-lg hover:bg-white hover:border-sky-300 hover:shadow-sky-200/30 flex items-center justify-center text-gray-700 pointer-events-auto transition-all duration-300 group"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-lg hover:bg-white hover:border-sky-300 hover:shadow-sky-200/30 flex items-center justify-center text-gray-700 pointer-events-auto transition-all duration-300 group"
              >
                <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* ==================== BENTO GRID ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">

            {/* COLUMN 1: Metric & Compliance */}
            <div className="flex flex-col gap-6 w-full">
              {/* CARD A: Dynamic metric with progress visualization */}
              <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/80 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-sky-200/30 transition-all duration-500 flex flex-col justify-between h-[220px] relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Live Metric</p>
                    <div className="h-12 relative overflow-hidden mt-1 w-40">
                      {slides.map((slide, index) => (
                        <h3
                          key={index}
                          className={cn(
                            "text-4xl font-black text-gray-900 tracking-tight absolute top-0 left-0 transition-all duration-500 ease-out",
                            index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
                          )}
                        >
                          {slide.salesVal}
                        </h3>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sky-50/80 backdrop-blur-sm border border-sky-200 px-3 py-1.5 rounded-full text-sky-800 shadow-sm">
                    <Activity className="h-3.5 w-3.5 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{activeSlide.growth}</span>
                  </div>
                </div>

                {/* Interactive progress bar */}
                <div className="relative py-5 flex items-center justify-between">
                  <div className="absolute inset-x-0 h-[2px] bg-gray-100 rounded-full" />
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full origin-left transition-transform duration-700 ease-out"
                    style={{ transform: `scaleX(${(activeIndex + 1) / slides.length})` }} />
                  <div className="relative z-10 flex w-full justify-between items-center">
                    {['BIM', 'ANALYTICS', 'SITE'].map((label, i) => (
                      <div key={label} className={cn(
                        "h-8 w-8 rounded-full border-2 flex items-center justify-center text-[9px] font-black transition-all duration-500",
                        i <= activeIndex ? "bg-black border-black text-white shadow-lg" : "bg-white border-gray-200 text-gray-400"
                      )}>
                        {i <= activeIndex ? <Check className="h-3.5 w-3.5 text-yellow-400" /> : label.substring(0, 1)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-100/80 pt-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  <span className="text-[11px] font-bold text-gray-600 tracking-wide uppercase truncate">
                    {activeSlide.metricLabel}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />
              </div>

              {/* CARD B: Dark compliance */}
              <div className="bg-gray-900 text-white rounded-[2rem] p-6 border border-gray-800/80 backdrop-blur-sm flex flex-col justify-between h-[170px] relative overflow-hidden group shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-sky-900/30 transition-all duration-500">
                <div className="relative z-10">
                  <div className="h-10 relative overflow-hidden w-48">
                    {slides.map((slide, index) => (
                      <h3
                        key={index}
                        className={cn(
                          "text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300 absolute top-0 left-0 transition-all duration-700 uppercase",
                          index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        )}
                      >
                        {slide.multiplierText}
                      </h3>
                    ))}
                  </div>
                  <div className="h-16 relative overflow-hidden w-full mt-1">
                    {slides.map((slide, index) => (
                      <p
                        key={index}
                        className={cn(
                          "text-xs text-gray-400 font-medium leading-snug absolute inset-x-0 top-0 transition-all duration-500",
                          index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                      >
                        {slide.multiplierSub}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.2)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>
            </div>

            {/* COLUMN 2: Featured image / video preview */}
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="group bg-white/80 backdrop-blur-md rounded-[2rem] p-3 border border-white/80 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-sky-200/30 transition-all duration-500 cursor-pointer flex flex-col justify-between h-[410px] relative overflow-hidden w-full"
            >
              <div className="relative h-[85%] w-full rounded-[1.5rem] overflow-hidden bg-gray-950 border border-gray-100/20">
                {slides.map((slide, index) => (
                  <img
                    key={index}
                    src={slide.claudiaImg}
                    alt={slide.claudiaTag}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out",
                      index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 z-20 shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">Inspect Portfolio</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ping-slow" />
                    <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm border border-sky-100 flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                      <Play className="h-6 w-6 text-gray-900 fill-gray-900 ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/80 shadow-lg z-20 flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">Yetosol Associates</h4>
                    <div className="h-4 relative overflow-hidden w-full mt-0.5">
                      {slides.map((slide, index) => (
                        <p
                          key={index}
                          className={cn(
                            "text-[10px] text-gray-500 font-bold uppercase tracking-wider absolute inset-x-0 top-0 transition-all duration-500",
                            index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                          )}
                        >
                          {slide.claudiaTag}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 pt-2 shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Live Feed</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">0:45 Preview</span>
              </div>
            </div>

            {/* COLUMN 3: Timeline & reviews – now spans full width on tablet */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/80 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-sky-200/30 transition-all duration-500 flex flex-col justify-between h-[410px] w-full md:col-span-2 lg:col-span-1">

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Workflow Timeline</span>
                  <span className="text-[10px] font-bold bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 px-3 py-1 rounded-full text-yellow-600 uppercase tracking-wider shadow-sm">
                    Phased
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  {[
                    { title: "Conceptual Layouts", stage: "Phase 1: Design", state: "Active", progress: 100 },
                    { title: "Working Drawings & Analytics", stage: "Phase 2: Pre-Tender", state: "Pending", progress: 65 },
                    { title: "On-site Supervision", stage: "Phase 3: Civil Works", state: "Ongoing", progress: 25 }
                  ].map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-dashed border-gray-100 last:border-b-0 group/item">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">{item.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{item.stage}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                          item.state === "Active" ? "bg-sky-50 text-sky-700" :
                            item.state === "Pending" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                        )}>{item.state}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Reviews Panel */}
              <div className="border-t border-gray-100/80 pt-4 mt-2">
                {reviewsLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-28 bg-gray-200 rounded-full" />

                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quality Standard</p>
                    <div className="bg-gradient-to-br from-sky-50/70 to-blue-50/30 backdrop-blur-sm border border-sky-100 p-3 rounded-2xl flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full overflow-hidden bg-white border-2 border-white shadow-md shrink-0">
                          <img src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784874600/Yetosol_Office_Mockup_eacot3.jpg" alt="Partner" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-[11px] font-black text-gray-900 uppercase tracking-wide truncate">Yetosol Review Panel</h5>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-black text-gray-800">
                              {reviews?.rating ? reviews.rating.toFixed(1) : "5.0"}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        href="https://share.google/k5OIxZYaLkh0Ze7Ig"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-9 rounded-full bg-white border border-sky-200 text-sky-700 flex items-center justify-center transition-all shrink-0 hover:bg-sky-100 hover:scale-105 shadow-sm"
                        title="View reviews on Google"
                      >
                        <Check className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================== ACCREDITATION BAR ==================== */}
          <div className="mt-20 border-t border-gray-200/80 pt-12 flex flex-col items-center gap-8 w-full">
            <div className="flex items-center gap-1 sm:gap-2 bg-sky-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200">
             <span className="font-bold text-yellow-400 text-xs sm:text-sm">XKWISIT SERVICES</span>
             <span className="text-[10px] sm:text-xs text-gray-800">PARTNER</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center">
              Adhering to international safety codes & engineering standards
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 hover:opacity-80 transition-opacity duration-500 select-none w-full max-w-4xl px-4">
              {['COREN Registered', 'NSE Member', 'NICE Structural', 'ISO 9001 Compliant'].map((cert) => (
                <span key={cert} className="font-black tracking-[0.1em] text-xs uppercase text-gray-700 hover:text-sky-700 hover:scale-105 transition-all duration-300 cursor-default">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SwipeableVideoModal
        open={isVideoModalOpen}
        onOpenChange={setIsVideoModalOpen}
      />
    </>
  );
}
