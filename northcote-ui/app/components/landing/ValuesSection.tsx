import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  MoveRight,
  X,
  CheckCircle2,
  Compass,
  Layers,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Building,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const values = [
  {
    id: "vision",
    title: "Vision",
    summary: "To be the foremost building construction firm in Nigeria.",
    detail: "Adopting professionalism and dedication for excellent project delivery, we set the benchmark for quality and reliability nationwide.",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867443/hero4_ryn2i8.jpg",
    icon: Compass,
    accentColor: "#EAB308",
    specs: [
      { label: "Target Horizon", value: "National Benchmark" },
      { label: "Core Focus", value: "Elite Architectural Engineering" },
      { label: "Standardization", value: "ISO 9001:2015 Compliant" },
    ],
    extendedText: "Our vision shapes our delivery. We approach every plot of land as a canvas for legacy engineering. By integrating building information modeling (BIM) with localized civil expertise, we ensure our projects transcend standard structural lifespans."
  },
  {
    id: "mission",
    title: "Mission",
    summary: "Deliver highest quality with latest technology.",
    detail: "We provide affordable, quality housing while maintaining a motivated team of professionals that turns client dreams into tangible structures.",
    icon: Layers,
    accentColor: "#0284C7",
    specs: [
      { label: "Delivery Engine", value: "Proprietary Tech-Stack" },
      { label: "Affordability Index", value: "Optimized Value Engineering" },
      { label: "Workforce", value: "Motivated In-House Specialists" },
    ],
    extendedText: "We dismantle the compromise between affordability and premium architectural execution. Through precision logistics, automated workflow routing, and advanced materials analysis, we translate blueprints into enduring realities."
  },
  {
    id: "quality",
    title: "Quality Statement",
    summary: "Commitment to standards, technology & service.",
    detail: "Imagination meets precision. Our customer‑focused approach ensures every build is a masterpiece of form and function.",
    icon: ShieldCheck,
    accentColor: "#EAB308",
    specs: [
      { label: "Quality Gates", value: "7-Phase Inspection Cycle" },
      { label: "Tolerance Rating", value: "Zero-Defect Protocol" },
      { label: "Customer Rating", value: "99.2% Satisfaction Score" },
    ],
    extendedText: "Quality is not an afterthought; it is structurally integrated. Our custom check-and-balance ecosystem ensures materials, dimensional tolerances, and finishes undergo rigorous mechanical tests prior to project sign-off."
  },
  {
    id: "heritage",
    title: "Heritage",
    summary: "Since 2006, building legacies.",
    detail: "From a small crew to a professional consultancy, our 150+ completed projects stand as monuments to integrity and trust.",
    icon: Award,
    accentColor: "#0284C7",
    specs: [
      { label: "Inception Year", value: "2006" },
      { label: "Completed Projects", value: "150+ Structural Landmarks" },
      { label: "Safety Record", value: "Zero Critical Incidents" },
    ],
    extendedText: "Over two decades, we have scaled from localized structural contracts to national infrastructure consulting. Our legacy is anchored in physical proof: millions of square feet standing secure across metropolitan centers."
  },
];

export default function ValuesSection() {
  const [selectedSpec, setSelectedSpec] = useState<typeof values[0] | null>(null);
  const [modalPage, setModalPage] = useState<1 | 2>(1);

  useEffect(() => {
    document.body.style.overflow = selectedSpec ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedSpec]);

  const openModal = (item: typeof values[0]) => {
    setModalPage(1);
    setSelectedSpec(item);
  };

  return (
    <section className="relative w-full bg-zinc-50/70 py-16 sm:py-24 font-sans antialiased overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-16">
        <div className="w-full mb-16 flex flex-col items-center text-center">
          <div className="space-y-6 w-full">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-normal leading-relaxed text-zinc-900 uppercase w-full text-center">
              Our {"    "} System {"    "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
                Architecture
              </span>
            </h2>
          </div>
          <div className="max-w-3xl border-t border-zinc-200/60 pt-6 mt-6 w-full">
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed font-medium">
              Our structural framework is built around distinct traits; precision, absolute reliability, and a verified commitment to transforming development concepts into physical masterpieces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
          {/* Card 1: Vision */}
          <div
            onClick={() => openModal(values[0])}
            className="md:col-span-12 lg:col-span-4 bg-white border border-zinc-200/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer"
          >
            <div>
              <div className="relative w-full aspect-[16/10] bg-zinc-100 rounded-2xl overflow-hidden mb-6 shadow-sm border border-zinc-100">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${values[0].image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mb-3 flex items-center justify-between">
                The {values[0].title}
                <Compass className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
              </h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
                {values[0].summary} {values[0].detail.slice(0, 78)}...
              </p>
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-zinc-100">
              <span className="text-sm font-bold text-zinc-800 group-hover:text-zinc-950 group-hover:underline">Read Specifications</span>
              <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 transition-all duration-300 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Mission */}
          <div
            onClick={() => openModal(values[1])}
            className="md:col-span-6 lg:col-span-4 bg-sky-50/70 border border-sky-100/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(2,132,199,0.08)] hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
              <svg className="w-full h-full" viewBox="0 0 200 300" fill="none">
                <path d="M-20,50 C50,120 120,20 180,140 C220,220 120,280 240,320" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white border border-sky-200/40 rounded-full px-3 py-1.5 mb-14 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-sky-600 flex items-center justify-center text-[9px] text-white font-bold">Y</div>
                <span className="text-[10px] font-bold text-zinc-850 tracking-wide uppercase">Ref / Execution</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-3">
                Our {values[1].title}
              </h4>
              <p className="text-zinc-800 text-sm font-medium leading-relaxed max-w-[95%]">
                {values[1].summary} Set via structural systems and vetted engineering logic.
              </p>
            </div>
            <div className="flex items-center justify-between pt-5 relative z-10 border-t border-sky-100">
              <span className="text-sm font-bold text-zinc-900 group-hover:underline">View Blueprint Deck</span>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-900 transition-transform duration-300 group-hover:rotate-45 shadow-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3 & 4 Stack */}
          <div className="md:col-span-6 lg:col-span-4 flex flex-col justify-between gap-6">
            <div
              onClick={() => openModal(values[2])}
              className="bg-white border border-zinc-200/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between flex-1 group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mb-3 flex items-center justify-between">
                  {values[2].title}
                  <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                </h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  Our blueprint methodology ensures <span className="text-sky-600 font-semibold">precision mechanics & tech</span> meet structural aesthetics flawlessly.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-zinc-100 mt-6">
                <span className="text-sm font-bold text-zinc-850 group-hover:text-zinc-950 group-hover:underline">Read Statement</span>
                <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 transition-all duration-300 group-hover:bg-zinc-950 group-hover:text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div
              onClick={() => openModal(values[3])}
              className="bg-white border border-zinc-200/50 rounded-3xl p-6 sm:p-8 space-y-4 group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(2,132,199,0.06)] hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center p-2.5 bg-sky-600 rounded-2xl text-white shadow-md shadow-sky-600/10">
                  <Award className="w-4 h-4" />
                </div>
                <MoveRight className="w-5 h-5 text-sky-600 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
              <p className="text-zinc-850 text-sm sm:text-base font-bold leading-snug tracking-tight">
                {values[3].title} &ndash; <span className="text-zinc-400 font-medium">delivering exceptional infrastructural milestones since our launch in 2006.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedSpec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpec(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.3)] border border-zinc-200 z-10 flex flex-col max-h-[85vh] sm:max-h-none"
            >
              <div className="h-2.5 w-full shrink-0" style={{ backgroundColor: selectedSpec.accentColor }} />
              <button
                onClick={() => setSelectedSpec(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/50 flex items-center justify-center text-zinc-600 transition-all hover:rotate-90 z-20"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${selectedSpec.accentColor}15` }}
                  >
                    <selectedSpec.icon className="w-5.5 h-5.5" style={{ color: selectedSpec.accentColor }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pillar Specification</span>
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mt-0.5">{selectedSpec.title}</h3>
                  </div>
                </div>
                <div className="flex border-b border-zinc-100 mb-6 font-semibold text-xs text-zinc-400">
                  <button
                    onClick={() => setModalPage(1)}
                    className={`pb-3 pr-6 border-b-2 transition-all ${modalPage === 1 ? "text-zinc-900 font-bold" : "hover:text-zinc-700"}`}
                    style={{ borderColor: modalPage === 1 ? selectedSpec.accentColor : "transparent" }}
                  >
                    01. Overview
                  </button>
                  <button
                    onClick={() => setModalPage(2)}
                    className={`pb-3 px-6 border-b-2 transition-all ${modalPage === 2 ? "text-zinc-900 font-bold" : "hover:text-zinc-700"}`}
                    style={{ borderColor: modalPage === 2 ? selectedSpec.accentColor : "transparent" }}
                  >
                    02. Specifications
                  </button>
                </div>
                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {modalPage === 1 ? (
                      <motion.div key="page-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Objective</h4>
                        <p className="text-zinc-900 text-base sm:text-lg font-bold leading-snug">"{selectedSpec.summary}"</p>
                        <p className="text-zinc-600 text-sm leading-relaxed">{selectedSpec.detail}</p>
                      </motion.div>
                    ) : (
                      <motion.div key="page-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 space-y-3.5">
                          {selectedSpec.specs.map((spec, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-zinc-200/40 pb-2 last:border-b-0 last:pb-0">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{spec.label}</span>
                              <span className="text-xs font-bold text-zinc-800">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="text-[11px] font-semibold text-emerald-800">
                            Verified Under Yetosol Engineering Protocols.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-5 mt-6">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Page {modalPage} of 2</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={modalPage === 1}
                      onClick={() => setModalPage(1)}
                      className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={modalPage === 2}
                      onClick={() => setModalPage(2)}
                      className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 mt-5 flex flex-wrap items-center justify-between text-[9px] font-mono text-zinc-400 gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>EST. 2006</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>NIGERIA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span>YETOSOL HUB</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}