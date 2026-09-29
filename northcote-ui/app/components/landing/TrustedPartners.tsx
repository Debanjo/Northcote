"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  TrendingUp,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const partnerCards = [
  { id: 1, name: "TAJ Bank", category: "Capital & Finance", tier: "Principal Financial Partner", location: "National Headquarters", scope: "Capital Projects & Infrastructure Financing", highlight: "Securing capital pipelines and branch-level advisory structural works.", color: "#EAB308" },
  { id: 2, name: "Blackcountry Ltd.", category: "Development", tier: "Premium Joint Venture", location: "Lekki, Lagos", scope: "Luxury Residential & High-Rise Structures", highlight: "Multi-family premium housing developments and coastal foundation works.", color: "#0284C7" },
  { id: 3, name: "Zenco Properties", category: "Urban Housing", tier: "Strategic Real Estate Partner", location: "Lagos Mainland", scope: "Urban Regeneration & Housing Estates", highlight: "Precision suburban zoning, structural planning, and modern estate layouts.", color: "#EAB308" },
  { id: 4, name: "Hasslan Properties", category: "Development", tier: "Commercial Ally", location: "Abuja / Lagos", scope: "Commercial Hubs & Shared Workspaces", highlight: "High-spec interior layouts, load-bearing partition engineering, and office towers.", color: "#0284C7" },
  { id: 5, name: "Sandhurst Properties", category: "Development", tier: "Real Estate Development Partner", location: "Lekki Phase 1, Lagos", scope: "High-End Residential Units", highlight: "Bespoke architectural shell execution, private estate development, and site grading.", color: "#EAB308" },
  { id: 6, name: "Everyday Kitchen Ltd.", category: "Design & Fit-Out", tier: "Interior Design Partner", location: "Metropolitan Centers", scope: "Premium Commercial Spaces & Hospitality", highlight: "Structural fit-out integrations, industrial culinary setups, and MEP synchronization.", color: "#0284C7" },
];

export default function TrustedPartners() {
  const [cards, setCards] = useState(partnerCards);

  const bringToFront = (clickedId: number) => {
    setCards((prev) => {
      const clickedCard = prev.find((c) => c.id === clickedId);
      const remaining = prev.filter((c) => c.id !== clickedId);
      return clickedCard ? [...remaining, clickedCard] : prev;
    });
  };

  const handleNext = () => {
    setCards((prev) => {
      const copy = [...prev];
      const topCard = copy.pop();
      if (topCard) copy.unshift(topCard);
      return copy;
    });
  };

  const handlePrev = () => {
    setCards((prev) => {
      const copy = [...prev];
      const bottomCard = copy.shift();
      if (bottomCard) copy.push(bottomCard);
      return copy;
    });
  };

  const activeCard = cards[cards.length - 1];
  const activeIndex = partnerCards.findIndex((c) => c.id === activeCard.id);

  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden font-sans antialiased">
      <div className="w-full px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100/80 border border-zinc-200/50 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Enterprise Network</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 uppercase leading-[1.05] mb-6">
            TRUSTED BY THE <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
              INDUSTRY'S FINEST
            </span>
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto">
            From institutional banking centers to luxury residential developments, our structural partners trust Yetosol to transform complex architectural concepts into high-value physical realities.
          </p>
        </div>

        {/* Black container – full width on mobile, contained on tablet+ */}
        <div className="relative w-full sm:w-auto max-w-6xl mx-auto bg-zinc-950 rounded-[32px] p-8 sm:p-12 lg:p-16 overflow-hidden min-h-[520px] flex flex-col lg:flex-row items-center gap-16 lg:gap-12 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-sky-500/10 to-amber-500/5 rounded-full blur-[100px] pointer-events-none select-none" />

          {/* Left Deck – smaller on mobile so cards don't touch container edges */}
          <div className="relative w-full max-w-[240px] sm:max-w-[340px] flex flex-col items-center shrink-0 gap-6 mx-auto sm:mx-0">
            <div className="relative w-full h-[320px]">
              {cards.map((card, index) => {
                const isFront = index === cards.length - 1;
                const offsetMultiplier = cards.length - 1 - index;
                if (offsetMultiplier > 2) return null;
                return (
                  <motion.div
                    key={card.id}
                    onClick={() => bringToFront(card.id)}
                    style={{ zIndex: index }}
                    animate={{
                      scale: 1 - offsetMultiplier * 0.05,
                      x: -offsetMultiplier * 16,
                      y: -offsetMultiplier * 10,
                      rotate: isFront ? 1 : -offsetMultiplier * 3,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute inset-0 bg-white border border-zinc-200 rounded-[24px] p-6 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.08)] cursor-pointer select-none origin-bottom-left"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                        <span className="text-[9px] font-mono font-extrabold tracking-widest text-zinc-400 uppercase">
                          {card.category} // SPEC {card.id}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-widest">Active</span>
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-zinc-950 tracking-tight">{card.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mt-0.5">{card.tier}</p>
                      <div className="mt-4 space-y-2">
                        <div className="text-[11px] text-zinc-500 leading-relaxed font-medium">{card.highlight}</div>
                      </div>
                    </div>
                    <div className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-zinc-400">
                        <MapPin className="w-3 h-3" />
                        <span>{card.location}</span>
                      </div>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all shadow-sm"
                        style={{ backgroundColor: card.color }}
                      >
                        {card.id}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800/80 px-4 py-2.5 rounded-full shadow-lg z-20">
              <button onClick={handlePrev} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/55 flex items-center justify-center text-zinc-300 transition-colors hover:text-white" title="Previous Partner">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">PROJECT</span>
                <span className="text-xs font-black text-white mt-0.5">{activeIndex + 1} / {partnerCards.length}</span>
              </div>
              <button onClick={handleNext} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/55 flex items-center justify-center text-zinc-300 transition-colors hover:text-white" title="Next Partner">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative z-10 flex-1 text-left">
            <span className="text-xs font-bold text-amber-500 tracking-[0.2em] uppercase block mb-3">Strategic Alliances</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Engineering Resilient Partnerships at Scale
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
              We leverage joint-venture structures to construct premium commercial towers and residential complexes. Our protocols optimize material supply lines and structural integrity checks.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700/50">
                    <FileCheck className="w-4 h-4 text-amber-500" />
                  </div>
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider">Vetted Escrows</h5>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Deep alignment with principal financial institutions guarantees structural capitalization.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700/50">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                  </div>
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider">High Asset Yield</h5>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Innovative development mapping ensures maximum footprint performance across Lagos.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
              >
                Inquire Alliance <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute bottom-[-20px] right-4 text-7xl sm:text-9xl font-black text-white/[0.02] tracking-widest select-none pointer-events-none uppercase font-mono">
            BUILD
          </div>
        </div>
      </div>
    </section>
  );
}