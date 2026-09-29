"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Home,
  Building2,
  Factory,
  RefreshCw,
  Wrench,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

/* ── Project Types (replaces “stages”) ── */
const projectTypes = [
  {
    id: "residential",
    icon: Home,
    title: "Residential",
    body: "A standard 3‑bedroom home with modern finishes. From foundation to handover, we deliver in approximately 20 weeks.",
    extended:
      "Our residential timeline includes 4 weeks for foundation, 8 weeks for superstructure, 6 weeks for finishing, and 2 weeks for final handover. Every phase is monitored to ensure quality and speed.",
    totalWeeks: 20,
    phases: [
      { name: "Foundation", weeks: 4 },
      { name: "Superstructure", weeks: 8 },
      { name: "Finishing", weeks: 6 },
      { name: "Handover", weeks: 2 },
    ],
    image:
      "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867441/Resident_tmpl7g.jpg",
  },
  {
    id: "commercial",
    icon: Building2,
    title: "Commercial",
    body: "A multi‑tenant office block with central core and MEP systems, typically completed in 42 weeks.",
    extended:
      "Commercial projects demand rigorous coordination. The timeline spans 8 weeks for foundation, 16 weeks for superstructure, 10 weeks for MEP, and 8 weeks for finishing. Our team ensures every milestone is met.",
    totalWeeks: 42,
    phases: [
      { name: "Foundation", weeks: 8 },
      { name: "Superstructure", weeks: 16 },
      { name: "MEP", weeks: 10 },
      { name: "Finishing", weeks: 8 },
    ],
    image:
      "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/Office_xqelku.jpg",
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Industrial",
    body: "A large‑span warehouse with steel frame, site prep, and commissioning, delivered in 24 weeks.",
    extended:
      "Industrial builds move fast once the steel is up. We allocate 4 weeks for site prep, 10 weeks for the steel frame, 6 weeks for cladding, and 4 weeks for commissioning.",
    totalWeeks: 24,
    phases: [
      { name: "Site Prep", weeks: 4 },
      { name: "Steel Frame", weeks: 10 },
      { name: "Cladding", weeks: 6 },
      { name: "Commissioning", weeks: 4 },
    ],
    image:
      "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/Factory_zavwpe.jpg",
  },
  {
    id: "renovation",
    icon: RefreshCw,
    title: "Renovation",
    body: "An office fit‑out with strip‑out, MEP upgrades, and finishing, completed in 16 weeks.",
    extended:
      "Renovation projects require careful phasing. We allow 3 weeks for strip‑out, 6 weeks for MEP upgrade, 5 weeks for finishing, and 2 weeks for snagging.",
    totalWeeks: 16,
    phases: [
      { name: "Strip‑Out", weeks: 3 },
      { name: "MEP Upgrade", weeks: 6 },
      { name: "Finishing", weeks: 5 },
      { name: "Snagging", weeks: 2 },
    ],
    image:
      "https://res.cloudinary.com/ami1jzfj/image/upload/v1784868828/Renovat_hpe00r.webp",
  },
  {
    id: "civil",
    icon: Wrench,
    title: "Civil Works",
    body: "Road and drainage infrastructure, from survey to handover, typically completed in 28 weeks.",
    extended:
      "Civil projects involve extensive earthworks. Our schedule: 6 weeks for survey & design, 10 weeks for earthworks, 8 weeks for paving/culverts, and 4 weeks for testing & handover.",
    totalWeeks: 28,
    phases: [
      { name: "Survey & Design", weeks: 6 },
      { name: "Earthworks", weeks: 10 },
      { name: "Paving/Culverts", weeks: 8 },
      { name: "Testing & Handover", weeks: 4 },
    ],
    image:
      "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867443/construction_start_1_wvoubr.webp",
  },
];

export default function ProjectTimelineStory() {
  const [activeTab, setActiveTab] = useState(0);
  const [showExtended, setShowExtended] = useState(false);

  const currentProject = projectTypes[activeTab];
  const Icon = currentProject.icon;

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setShowExtended(false);
  };

  const prevTab = () => setActiveTab((prev) => Math.max(0, prev - 1));
  const nextTab = () =>
    setActiveTab((prev) => Math.min(projectTypes.length - 1, prev + 1));

  return (
    <section className="relative bg-[#F9F9F6] py-20 sm:py-28 overflow-hidden font-sans antialiased">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-sky-200/20 blur-[80px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-yellow-200/20 blur-[80px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-yellow-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-800">Project Planning</span>
          </div>
          <h2 className="text-[clamp(1.95rem,5vw,3.5rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            The{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${'#F5A623'}, ${'#4A90E2'})` }}
            >
              Timeline
            </span>
          </h2>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Every project follows a carefully engineered schedule. See how long each phase takes for different construction types.
          </p>
        </motion.div>

        {/* Dark Problem Statement Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative bg-[#1C1F22] rounded-[32px] p-8 sm:p-12 text-white overflow-hidden mb-16 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-sky-500 filter blur-[80px] opacity-20 transform translate-x-1/3 -translate-y-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <Clock className="h-8 w-8 text-sky-400 mb-4" />
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                The real question isn't what you're building.
              </h3>
              <p className="text-white/70 max-w-lg leading-relaxed">
                It's <strong>how long</strong> it will take, and whether your timeline is grounded in reality. Without a clear schedule, even the best plans can stall. Yetosol brings clarity to every phase.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784867443/hero4_ryn2i8.jpg"
                alt="Construction timeline planning"
                className="w-full h-44 w-auto object-contain rounded-2xl shadow-[0_10px_24px_rgba(0,0,0,0.4)]"
              />
            </div>
          </div>
        </motion.div>

        {/* Interactive Pill Tab Journey */}
        <div className="mb-16">
          {/* Pill Controller */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap gap-2 justify-center bg-white border border-gray-200 rounded-full p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              {projectTypes.map((project, idx) => {
                const TabIcon = project.icon;
                const isActive = activeTab === idx;
                return (
                  <motion.button
                    key={project.id}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleTabChange(idx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <TabIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">{project.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Active Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left: Text */}
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {currentProject.title} Project
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {showExtended ? currentProject.extended : currentProject.body}
                  </p>
                  {!showExtended && (
                    <button
                      onClick={() => setShowExtended(true)}
                      className="text-sky-600 font-semibold hover:underline"
                    >
                      View Full Breakdown →
                    </button>
                  )}
                  {showExtended && (
                    <button
                      onClick={() => setShowExtended(false)}
                      className="text-sky-600 font-semibold hover:underline"
                    >
                      Show Less ↑
                    </button>
                  )}

                  {/* Total weeks badge */}
                  <div className="mt-6 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-5 py-2.5 shadow-sm">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-lg font-black text-gray-900">
                      {currentProject.totalWeeks} Weeks Total
                    </span>
                  </div>
                </div>

                {/* Right: Image + floating accent */}
                <div className="relative flex justify-center">
                  <motion.img
                    src={currentProject.image}
                    alt={currentProject.title}
                    initial={{ scale: 0.95, borderRadius: 32 }}
                    animate={{ scale: 1, borderRadius: 32 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="h-72 w-auto object-contain rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                  />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-sky-600 flex items-center justify-center shadow-lg transform -rotate-6">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              onClick={prevTab}
              disabled={activeTab === 0}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-sky-400 hover:text-sky-600 disabled:opacity-30 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTab}
              disabled={activeTab === projectTypes.length - 1}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-sky-400 hover:text-sky-600 disabled:opacity-30 transition-all"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            That's exactly why we plan meticulously.
          </h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            A clear timeline keeps your project on track. At Yetosol, every phase is engineered for precision, so you always know what's next.
          </p>
        </motion.div>
      </div>
    </section>
  );
}