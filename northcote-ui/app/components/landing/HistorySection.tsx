"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

/* ── Timeline Data ── */
const timelineEvents = [
  {
    year: "2006",
    period: "The Foundation",
    title: "Started as a small construction crew",
    description:
      "Begun as a localized specialized structural team, delivering precise custom framings and residential masonry designs across private Lagos development sectors.",
    metric: "1st Project Delivered",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/cooperate_pjiop9.jpg",
    stats: { projects: 1, team: 5 },
  },
  {
    year: "2016",
    period: "Institutional Scaling",
    title: "Incorporation of Yetosol Associates",
    description:
      "Officially incorporated as Yetosol Associates (RC 553088). Formalized rigorous engineering compliance protocols, scaling our operational footprint to commercial real estate.",
    metric: "RC 553088 Registered",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867448/safety_ct3lct.jpg",
    stats: { projects: 25, team: 18 },
  },
  {
    year: "2018",
    period: "Territorial Expansion",
    title: "Expanded operations to multiple states",
    description:
      "Secured high-yield developmental partnerships. Extended civil engineering and project delivery networks outside Lagos, solidifying operations across Nigeria's major urban centers.",
    metric: "5+ States Penetrated",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/construction_mid_b5f1ns.webp",
    stats: { projects: 80, team: 35 },
  },
  {
    year: "2026",
    period: "Modern Epoch",
    title: "Over 150 projects successfully delivered",
    description:
      "Transforming urban spaces utilizing state-of-the-art structural materials, cloud-synced timeline management, and joint-venture frameworks with elite financial partners.",
    metric: "150+ Structures Built",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/construction_last_elzwa8.webp",
    stats: { projects: 150, team: 50 },
  },
];

const CARDS_PER_PAGE = 2;
const TOTAL_PAGES = Math.ceil(timelineEvents.length / CARDS_PER_PAGE);

export default function HistorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  const activeEvent = timelineEvents[activeIndex];

  const handlePrev = () => setActiveIndex((p) => Math.max(0, p - 1));
  const handleNext = () => setActiveIndex((p) => Math.min(timelineEvents.length - 1, p + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Get the two events for current mobile page
  const startIdx = mobilePage * CARDS_PER_PAGE;
  const visibleEvents = timelineEvents.slice(startIdx, startIdx + CARDS_PER_PAGE);

  const goToMobilePage = (page: number) => {
    setMobilePage(Math.max(0, Math.min(TOTAL_PAGES - 1, page)));
  };

  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden font-sans antialiased">
      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-yellow-200/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-200/15 rounded-full blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.012] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-yellow-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-800">Our Journey</span>
          </div>
          <h2 className="text-[clamp(1.95rem,5vw,4rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            The <span className="text-yellow-600">Yetosol</span> Story
          </h2>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            From a small crew to a professional consultancy, our timeline of growth, integrity, and structural excellence.
          </p>
        </motion.div>

        {/* ── Desktop: Arrow Navigation + Active Milestone Card ── */}
        <div className="hidden md:block relative">
          <div className="relative flex items-center justify-center">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="absolute left-0 z-30 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous milestone"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            {/* Active Milestone Card */}
            <div className="w-full max-w-5xl mx-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Image Column */}
                    <div className="lg:col-span-5 relative">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative group">
                        <img
                          src={activeEvent.image}
                          alt={activeEvent.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Floating stat badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-yellow-200 p-4 flex items-center gap-3"
                      >
                        <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-md">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-gray-900 leading-none">
                            {activeEvent.year}
                          </p>
                          <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mt-1 flex items-center gap-1">
                            {activeEvent.metric}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest rounded-full">
                          {activeEvent.period}
                        </span>
                        <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">
                          {activeEvent.year}
                        </span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                        {activeEvent.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                        {activeEvent.description}
                      </p>

                      {/* Mini Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-gray-900">{activeEvent.stats.projects}+</p>
                            <p className="text-xs text-gray-500 font-medium">Projects</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-gray-900">{activeEvent.stats.team}+</p>
                            <p className="text-xs text-gray-500 font-medium">Team Members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              disabled={activeIndex === timelineEvents.length - 1}
              className="absolute right-0 z-30 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next milestone"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Navigation label */}
          <div className="flex justify-center mt-6 text-sm font-mono font-bold text-gray-400 uppercase tracking-widest">
            <button onClick={handlePrev} disabled={activeIndex === 0} className="hover:text-gray-600 disabled:opacity-30">
              Previous
            </button>
            <span className="mx-4 text-gray-900">{activeIndex + 1} / {timelineEvents.length}</span>
            <button onClick={handleNext} disabled={activeIndex === timelineEvents.length - 1} className="hover:text-gray-600 disabled:opacity-30">
              Next
            </button>
          </div>
        </div>

        {/* ── Mobile: Two Cards Per Page ── */}
        <div className="md:hidden space-y-6">
          {/* Cards for current page */}
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="wait">
              {visibleEvents.map((event, idx) => {
                const globalIdx = timelineEvents.indexOf(event);
                const isActive = globalIdx === activeIndex;
                return (
                  <motion.div
                    key={event.year}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setActiveIndex(globalIdx)}
                    className={`cursor-pointer transition-all duration-300 ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-80"
                      }`}
                  >
                    <div
                      className={`bg-white/80 backdrop-blur-xl border rounded-3xl p-5 shadow-lg ${isActive ? "border-yellow-400 shadow-[0_15px_40px_rgba(245,166,35,0.15)]" : "border-white/60"
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl font-black text-yellow-600">{event.year}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
                          {event.period}
                        </span>
                      </div>
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md mb-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mb-2">{event.title}</h3>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-gray-600 text-sm leading-relaxed mb-3"
                        >
                          {event.description}
                        </motion.p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-yellow-600">
                          <Star className="h-4 w-4 fill-current" />
                          {event.metric}
                        </div>
                        <div className="flex gap-2 text-xs text-gray-400">
                          <span>{event.stats.projects} projects</span>
                          <span>·</span>
                          <span>{event.stats.team} team</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 pt-2">
            <button
              onClick={() => goToMobilePage(mobilePage - 1)}
              disabled={mobilePage === 0}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="flex items-center text-sm font-mono font-bold text-gray-400">
              {mobilePage + 1} / {TOTAL_PAGES}
            </div>
            <button
              onClick={() => goToMobilePage(mobilePage + 1)}
              disabled={mobilePage === TOTAL_PAGES - 1}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}