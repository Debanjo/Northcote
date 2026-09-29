"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const team = [
  {
    name: "Onanibosi Onayemi Segun",
    role: "Managing Partner / Projects Manager",
    credentials: "BSc, MNSE, MNICE, C.Eng",
    bio: "Civil/Structural engineer with expertise in CAD software and project supervision. Completed numerous building, highway, and bridge projects.",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/onayemi_fgtdjr.webp",
  },
  {
    name: "Aromiwura Adedamola Oluwaseun",
    role: "Partner / Projects Manager",
    credentials: "BSc, MSc, MNSE, MNICE, C.Eng",
    bio: "Structural engineer with consultancy skills from Newcastle University. Specializes in tank farms and general construction.",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/Aromiwura_gjimoc.webp",
  },
  {
    name: "Adeleye Oluwaseun Ademola",
    role: "Projects Director",
    credentials: "BSc, MSc, MNSE, MNICE",
    bio: "Construction management expert with experience in low‑rise to high‑rise buildings and highways.",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/Adeleye_wqniyt.webp",
  },
  {
    name: "Ajiboye Jolajesu O.",
    role: "Engineering Manager",
    credentials: "BEng, MSc",
    bio: "Water and waste engineering specialist with project management experience across multiple projects.",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/ajiboye_m2yhs1.webp",
  },
  {
    name: "Awoniyi Rapheal",
    role: "Builder / Facility Manager",
    credentials: "HND",
    bio: "A Builder by training and an experienced facility manager, he manages the maintenance of the firm's projects, ensuring they serve intended purposes.",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/awoniyi_nefyga.webp",
  },
  {
    name: "Adekoya Adeyemi Abolanle",
    role: "Procurement Manager / Quantity Surveyor",
    credentials: "B.Tech, MSc",
    bio: "Dynamic quantity surveyor with over five years' experience. Involved in preparation of Bills of Quantities for several projects across West Africa.",
    image: "",
  },
];

/* ── Custom easing tuple (avoids TS widening) ── */
const customEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (dir: "prev" | "next") => ({
    x: dir === "next" ? 80 : -80,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: customEase },
  },
  exit: (dir: "prev" | "next") => ({
    x: dir === "next" ? -80 : 80,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.4, ease: customEase },
  }),
};

export default function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"prev" | "next">("next");
  const member = team[currentIndex];

  const goNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % team.length);
  };

  const goPrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden font-sans antialiased">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-yellow-50/20 to-sky-50/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sky-100 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-800">Our Experts</span>
          </div>
          <h2 className="text-[clamp(1rem,6vw,4.5rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            Meet the <span className="text-yellow-600">Team</span>
          </h2>
        </motion.div>

        {/* Desktop split layout (md+) */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-12 gap-12 lg:gap-20 items-center"
            >
              {/* Left: Profile card */}
              <div className="col-span-6 lg:col-span-5 flex justify-end">
                <div className="relative w-full max-w-md">
                  <div className="relative aspect-[3/4] w-full rounded-[40px] overflow-hidden bg-gradient-to-br from-slate-100 to-white/50 backdrop-blur-xl border border-white/50 
                                  shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)] 
                                  group"
                  >
                    <div className="absolute inset-0 rounded-[40px] border-[1px] border-white/80 pointer-events-none z-10" />
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl font-black text-yellow-600 bg-gradient-to-br from-yellow-50 to-sky-50">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-yellow-400/20 blur-xl group-hover:scale-125 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Right: Text content */}
              <div className="col-span-6 lg:col-span-7">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest rounded-full">
                      {member.role.split("/")[0].trim()}
                    </span>
                    <span className="text-sm font-bold text-sky-600 uppercase tracking-[0.2em]">{member.credentials}</span>
                  </div>
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed max-w-xl">
                    {member.bio}
                  </p>
                  <div className="flex gap-4 pt-2">
                    <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-yellow-50 text-gray-500 hover:text-yellow-600 flex items-center justify-center transition-colors border border-gray-200">
                      <Linkedin className="h-5 w-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-sky-50 text-gray-500 hover:text-sky-600 flex items-center justify-center transition-colors border border-gray-200">
                      <Mail className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center gap-8"
            >
              <div className="w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gradient-to-br from-yellow-50 to-sky-50">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-yellow-600">
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="text-center space-y-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest rounded-full inline-block">
                  {member.role.split("/")[0].trim()}
                </span>
                <h3 className="text-2xl font-black text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                <p className="text-xs font-medium text-sky-600">{member.credentials}</p>
                <div className="flex gap-4 justify-center pt-2">
                  <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-yellow-50 text-gray-500 hover:text-yellow-600 flex items-center justify-center transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-sky-50 text-gray-500 hover:text-sky-600 flex items-center justify-center transition-colors">
                    <Mail className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-6 mt-12 md:mt-16">
          <button
            onClick={goPrev}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            onClick={goNext}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700 font-medium"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-6 text-sm text-gray-400 font-medium">
          {currentIndex + 1} / {team.length}
        </div>
      </div>
    </section>
  );
}