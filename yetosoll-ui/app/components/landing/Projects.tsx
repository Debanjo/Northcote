import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Layers,
  MapPin,
  Binary,
  Activity,
  Maximize2,
  Languages,
  Cpu,
  ShieldAlert,
  Briefcase,
  FileCheck2
} from "lucide-react";

const categories = ["All Projects", "Building Construction", "Civil Works", "Facility Management", "Redevelopment"];

const projects = [
  {
    title: "Ikoyi Building Pipeline",
    category: "Building Construction",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Ikoyi, Lagos",
    metrics: [
      { label: "Concrete Class", val: "C40/50", color: "text-sky-600" },
      { label: "Design Shear", val: "V_Ed = 850 kN", color: "text-amber-500" },
      { label: "Bored Piles", val: "32m Depth", color: "text-emerald-600" }
    ],
    governingFormula: "V_{Rd,c} = [C_{Rd,c} k (100 \\rho_l f_{ck})^{1/3}] b_w d",
    english: "A 15-floor luxury residential high-rise utilizing an advanced shear-wall core system, deep bored piling, and post-tensioned concrete slabs to maximize spatial layouts.",
    pidgin: "Solid 15-floor high-rise block wey we build with deep pile foundations, shear-wall pillars to stand strong wind, and flat concrete decking to save space inside.",
    blueprint: "superstructure"
  },
  {
    title: "Luxury Residential",
    category: "Building Construction",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867450/sand2_ppkfzm.jpg",
    location: "Victoria Island, Lagos",
    metrics: [
      { label: "Foundation", val: "Raft Slab", color: "text-emerald-600" },
      { label: "Rebar Yield", val: "500 N/mm²", color: "text-sky-600" },
      { label: "Max Span", val: "8.5m", color: "text-amber-500" }
    ],
    governingFormula: "M_u = 0.167 f_{cu} b d^2",
    english: "A premium waterfront villa optimized for sandy marine soil via an integrated continuous concrete raft foundation and high-corrosion-resistant coated reinforcement.",
    pidgin: "Fine soft-work duplex for waterfront wey stand on top flat concrete raft foundation so sand no go fit shift, with special iron rod wey rust no fit touch.",
    blueprint: "residential"
  },
  {
    title: "Warehouse Industry",
    category: "Civil Works",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/Factory_zavwpe.jpg",
    location: "Ibeju-Lekki, Lagos",
    metrics: [
      { label: "Steel Grade", val: "S355 JR", color: "text-sky-600" },
      { label: "Span Space", val: "24m Clear", color: "text-amber-500" },
      { label: "Soil Capacity", val: "180 kN/m²", color: "text-emerald-600" }
    ],
    governingFormula: "N_{Ed} / N_{c,Rd} \\le 1.0",
    english: "A massive industrial logistics hub utilizing heavy pre-engineered portal frames, designed with zero interior column interference for absolute volumetric storage.",
    pidgin: "Big dry-port factory house wey stand on top heavy structural steel columns without any pillar for center—so heavy trailers and loaders fit drive anyhow.",
    blueprint: "portal"
  },
  {
    title: "Office Remodelling",
    category: "Redevelopment",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784868828/Renovat_hpe00r.webp",
    location: "Marina, Lagos",
    metrics: [
      { label: "Audit Rating", val: "Class A", color: "text-emerald-600" },
      { label: "New Capacity", val: "+35% Load", color: "text-sky-600" },
      { label: "Concrete Comp", val: "30 N/mm²", color: "text-amber-500" }
    ],
    governingFormula: "E_c = 22 \\times 10^3 [f_{cm}/10]^{0.3}",
    english: "Complete internal spatial reconfiguration and structural optimization of a commercial banking hall, incorporating modern load bearing redistributions.",
    pidgin: "We break down and re-arrange old banking hall to expand layout, adding modern support beams to hold fresh computer networks and heavy secure doors.",
    blueprint: "retrofit"
  },
  {
    title: "Facility Upgrade",
    category: "Facility Management",
    image: "https://images.unsplash.com/photo-1581091870622-1e01dcc59f48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Ikeja, Lagos",
    metrics: [
      { label: "Sensor Uptime", val: "99.98%", color: "text-emerald-600" },
      { label: "Vibration Peak", val: "1.2 mm/s", color: "text-amber-500" },
      { label: "Cooling Load", val: "180 RT", color: "text-sky-600" }
    ],
    governingFormula: "f_v = \\frac{1}{2\\pi} \\sqrt{\\frac{k}{m}}",
    english: "Installation of real-time structural health monitoring sensors paired with custom mechanical support frameworks to house advanced industrial production HVAC setups.",
    pidgin: "We set up automated sensors to track how building dey vibrate during machine operation, plus heavy metal hangings to support big industrial central AC.",
    blueprint: "hvac"
  },
  {
    title: "Retrofitting Project",
    category: "Redevelopment",
    image: "https://images.unsplash.com/photo-1504328345282-9b99358f75ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Lekki Phase 1, Lagos",
    metrics: [
      { label: "Wrap Class", val: "CFRP T700", color: "text-sky-600" },
      { label: "Added Shear", val: "V_fd = 240 kN", color: "text-emerald-600" },
      { label: "Micro-piling", val: "14m Depth", color: "text-amber-500" }
    ],
    governingFormula: "M_{Rd} = M_{Rd,c} + M_{Rd,f}",
    english: "Structural rescue of a distressed multi-family residential building using structural polymer carbon-fiber wraps (CFRP) on critical support columns.",
    pidgin: "We rescue one shaking duplex building wey wan collapse by wrapping all the crack pillars with aerospace carbon-fiber sheets to double their life span.",
    blueprint: "cfwrap"
  }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lang, setLang] = useState<"english" | "pidgin">("english");

  const filteredProjects = activeCategory === "All Projects"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const currentProject = filteredProjects[selectedIdx] || filteredProjects[0] || projects[0];

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedIdx(0);
  };

  return (
    <section id="projects" className="relative bg-slate-50 dark:bg-zinc-950 py-12 md:py-24 overflow-hidden font-sans">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #eab308 1px, transparent 1px),
            linear-gradient(to bottom, #eab308 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-zinc-900 pb-6 mb-6 sm:pb-8 sm:mb-8 lg:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 dark:border-yellow-500/30 rounded-full mb-3">
              <Briefcase className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <span className="text-[10px] font-black tracking-[0.2em] text-yellow-750 dark:text-yellow-400 uppercase">Interactive Portfolio</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
              ENGINEERED LANDMARKS <br />
              <span className="text-yellow-650 dark:text-yellow-400">REALIZED PROJECT LOGS</span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed max-w-sm">
            Select an active pipeline coordinate below to view live computational load simulations, structural blueprints, and site parameters.
          </p>
        </div>

        {/* Category Swipe */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent dark:from-zinc-950 pointer-events-none z-10 sm:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent dark:from-zinc-950 pointer-events-none z-10 sm:hidden" />
          <div className="flex overflow-x-auto scrollbar-none gap-2 px-4 sm:px-0 sm:flex-wrap sm:justify-start pb-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 shrink-0 whitespace-nowrap border",
                    isActive
                      ? "bg-slate-950 border-slate-950 text-white dark:bg-white dark:border-white dark:text-black shadow-md"
                      : "bg-white border-slate-200 text-slate-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 hover:border-slate-350 dark:hover:border-zinc-700"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Directory */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block pl-1">
              Active Directory ({filteredProjects.length} Pipeline Nodes)
            </span>
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-none pr-1">
              {filteredProjects.map((project, idx) => {
                const isSelected = (filteredProjects[selectedIdx]?.title === project.title) || (idx === 0 && !filteredProjects[selectedIdx]);
                return (
                  <button
                    key={project.title}
                    onClick={() => setSelectedIdx(idx)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 relative overflow-hidden group",
                      isSelected
                        ? "bg-slate-950 border-slate-950 text-white dark:bg-zinc-900 dark:border-zinc-800 shadow-md"
                        : "bg-white border-slate-200 text-slate-700 dark:bg-zinc-900/40 dark:border-zinc-900 hover:border-slate-350 dark:hover:border-zinc-850 hover:bg-slate-50/50 dark:hover:bg-zinc-900/80"
                    )}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-zinc-800 relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-black text-xs uppercase tracking-tight truncate">
                          {project.title}
                        </h3>
                        <ArrowUpRight className={cn(
                          "w-3.5 h-3.5 shrink-0 transition-transform",
                          isSelected ? "text-yellow-500 translate-x-0.5 -translate-y-0.5" : "text-slate-400 opacity-0 group-hover:opacity-100"
                        )} />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-semibold">
                        <span className={isSelected ? "text-yellow-400" : "text-yellow-600 dark:text-yellow-400"}>
                          {project.category}
                        </span>
                        <span className={isSelected ? "text-slate-400" : "text-slate-400 dark:text-zinc-500"}>•</span>
                        <span className={cn("truncate flex items-center gap-1", isSelected ? "text-slate-300" : "text-slate-500 dark:text-zinc-400")}>
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" /> {project.location}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-4 bg-slate-100/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-900 rounded-2xl hidden lg:block">
              <p className="text-[10px] font-mono font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1.5 flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-yellow-500 animate-pulse" /> Live Telemetry Feed
              </p>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-500 dark:text-zinc-400">
                <div className="bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-150 dark:border-zinc-850">
                  <span>LATENCY: </span>
                  <span className="text-emerald-500 font-bold">14ms (OK)</span>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-150 dark:border-zinc-850">
                  <span>ISO ACCRED: </span>
                  <span className="text-sky-500 font-bold">9001:2015</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Spec Sheet */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] overflow-hidden h-full flex flex-col justify-between">
              {/* Terminal Title Bar */}
              <div className="bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-150 dark:border-zinc-850 p-4 sm:p-6 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-250 dark:border-yellow-500/20 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-mono font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block truncate">
                      ENGINEERING PORTAL PLOTTER
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight block truncate">
                      CAD Render // {currentProject.title}
                    </span>
                  </div>
                </div>
                {/* Language Toggle */}
                <div className="inline-flex p-1 bg-slate-200/60 dark:bg-zinc-950/60 rounded-xl shrink-0 self-end xs:self-auto w-full xs:w-auto">
                  <button
                    onClick={() => setLang("english")}
                    className={cn(
                      "flex-1 xs:flex-none px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all",
                      lang === "english"
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLang("pidgin")}
                    className={cn(
                      "flex-1 xs:flex-none px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 justify-center",
                      lang === "pidgin"
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    Pidgin 🇳🇬
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="p-4 sm:p-6 flex-1 space-y-5">
                {/* SVG Render */}
                <div className="relative w-full h-36 sm:h-48 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                  <div className="absolute top-2.5 left-3 flex items-center gap-1 text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    <Maximize2 className="h-2.5 w-2.5 text-slate-600" /> Active Frame
                  </div>
                  <div className="absolute bottom-2.5 right-3 text-[8px] font-mono text-slate-550 tracking-wider">
                    GRID CAL: S3.2
                  </div>
                  <AnimatePresence mode="wait">
                    {currentProject.blueprint === "superstructure" && (
                      <motion.svg key="superstructure-port" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="w-full h-full p-4 stroke-sky-400" viewBox="0 0 400 150" fill="none">
                        <rect x="140" y="20" width="120" height="110" stroke="#334155" strokeWidth="1" />
                        <line x1="140" y1="45" x2="260" y2="45" stroke="#f59e0b" strokeWidth="2" />
                        <line x1="140" y1="75" x2="260" y2="75" stroke="#0ea5e9" strokeWidth="2" />
                        <line x1="140" y1="105" x2="260" y2="105" stroke="#0ea5e9" strokeWidth="2" />
                        <line x1="200" y1="20" x2="200" y2="130" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                      </motion.svg>
                    )}
                    {currentProject.blueprint === "residential" && (
                      <motion.svg key="residential-port" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="w-full h-full p-4 stroke-amber-500" viewBox="0 0 400 150" fill="none">
                        <rect x="80" y="110" width="240" height="20" stroke="#f59e0b" strokeWidth="3" />
                        <rect x="110" y="30" width="180" height="80" stroke="#334155" strokeWidth="1.5" />
                        <path d="M 110,70 L 290,70" stroke="#10b981" strokeWidth="1.5" />
                        {[130, 160, 190, 220, 250, 270].map((x, i) => (
                          <line key={i} x1={x} y1="110" x2={x} y2="130" stroke="#ef4444" strokeWidth="1" />
                        ))}
                      </motion.svg>
                    )}
                    {currentProject.blueprint === "portal" && (
                      <motion.svg key="portal-port" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="w-full h-full p-4 stroke-emerald-500" viewBox="0 0 400 150" fill="none">
                        <path d="M 60,120 L 60,40 L 200,15 L 340,40 L 340,120" stroke="#10b981" strokeWidth="2" />
                        <path d="M 50,120 L 350,120" stroke="#334155" strokeWidth="1.5" />
                        <line x1="60" y1="40" x2="130" y2="28" stroke="#f59e0b" strokeWidth="1" />
                        <line x1="340" y1="40" x2="270" y2="28" stroke="#f59e0b" strokeWidth="1" />
                      </motion.svg>
                    )}
                    {currentProject.blueprint === "retrofit" && (
                      <motion.svg key="retrofit-port" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="w-full h-full p-4 stroke-rose-500" viewBox="0 0 400 150" fill="none">
                        <rect x="100" y="30" width="200" height="90" stroke="#334155" strokeWidth="1" />
                        <circle cx="200" cy="75" r="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                        <line x1="80" y1="75" x2="320" y2="75" stroke="#10b981" strokeWidth="1" />
                      </motion.svg>
                    )}
                    {currentProject.blueprint === "hvac" && (
                      <motion.svg key="hvac-port" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="w-full h-full p-4 stroke-teal-500" viewBox="0 0 400 150" fill="none">
                        <rect x="130" y="40" width="140" height="70" stroke="#334155" strokeWidth="1.5" />
                        <circle cx="170" cy="75" r="20" stroke="#0ea5e9" strokeWidth="1" />
                        <circle cx="230" cy="75" r="20" stroke="#0ea5e9" strokeWidth="1" />
                        <path d="M 80 75 Q 105 50 130 75" stroke="#ef4444" strokeWidth="1" />
                        <path d="M 270 75 Q 295 100 320 75" stroke="#10b981" strokeWidth="1" />
                      </motion.svg>
                    )}
                    {currentProject.blueprint === "cfwrap" && (
                      <motion.svg key="cfwrap-port" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="w-full h-full p-4 stroke-violet-500" viewBox="0 0 400 150" fill="none">
                        <rect x="160" y="20" width="80" height="110" stroke="#475569" strokeWidth="2" />
                        {[30, 45, 60, 75, 90, 105, 120].map((y, idx) => (
                          <line key={idx} x1="160" y1={y} x2="240" y2={y + 10} stroke="#8b5cf6" strokeWidth="1.5" />
                        ))}
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                  {currentProject.metrics.map((metric, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 rounded-xl min-w-0">
                      <p className="text-[8px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider truncate">
                        {metric.label}
                      </p>
                      <p className={cn("text-[10px] sm:text-xs font-mono font-black mt-0.5 truncate", metric.color)}>
                        {metric.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Formula */}
                <div className="p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/10 dark:border-yellow-500/20 rounded-xl flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <span className="text-[8px] font-black text-yellow-750 dark:text-yellow-400 uppercase tracking-wider block">
                      Active Governing Structural Rule
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 block truncate">
                      Computational Limit State Formulation:
                    </span>
                  </div>
                  <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 px-2 py-1.5 rounded-lg shadow-sm shrink-0 self-start xs:self-auto">
                    <code className="text-[10px] sm:text-[11px] font-mono font-black text-slate-900 dark:text-yellow-400">
                      ${currentProject.governingFormula}$
                    </code>
                  </div>
                </div>

                {/* Briefing */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block pl-0.5">
                    Engineering Briefing File
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${currentProject.title}-${lang}`}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="text-slate-650 dark:text-zinc-355 text-xs font-medium leading-relaxed"
                    >
                      {currentProject[lang]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-150 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 font-semibold leading-tight">
                    {lang === "english"
                      ? "Design reports certified for standard municipal building authority submission."
                      : "We set down stamps properly for civil authorities and building controls."
                    }
                  </span>
                </div>
                <Button
                  onClick={() => window.location.href = "mailto:info@yetosol.com?subject=Portfolio%20Design%20Consultation"}
                  className="w-full sm:w-auto h-10 bg-slate-900 hover:bg-slate-950 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
                >
                  Request Technical Proposal <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12">
          <span className="text-[10px] font-mono font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block pl-1 mb-3">
            Physical Site Asset Render
          </span>
          <div className="relative h-64 md:h-[450px] rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-850 shadow-xl group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentProject.image}
                src={currentProject.image}
                alt={currentProject.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-md">
                  {currentProject.category}
                </span>
                <h4 className="text-white text-lg md:text-2xl font-black uppercase mt-1.5">{currentProject.title}</h4>
                <p className="text-slate-300 text-xs font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> {currentProject.location}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[9px] font-mono text-slate-300 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-yellow-500" /> Ground Conditions Under Review
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}