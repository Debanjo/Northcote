"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Layers, ShieldCheck, CheckCircle2, Droplet, Anchor,
  ArrowUpRight, X, ChevronDown, HardHat, Activity, GitCommit, Sparkles,
  Mail, Phone, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const languages = ["english", "pidgin", "yoruba", "igbo", "hausa"] as const;

const disciplines = {
  superstructure: {
    id: "superstructure", title: "Superstructure Frame", subtitle: "High‑Rise Core Frameworks", icon: Layers,
    english: { shortDesc: "We design the structural bones of your building.", deliverables: ["FEA Stress Analysis", "Iron Rod Detailing", "Steel Joint Engineering", "Wind Resistance"] },
    pidgin: { shortDesc: "We dey design the main strong bones for your building.", deliverables: ["Computer load check", "Correct iron rod plan", "Steel joint designs", "Strong breeze calculations"] },
    yoruba: { shortDesc: "A n se apere agbara ile yin.", deliverables: ["Ayewo FEA", "Eto irin ti o dara", "Eto irin", "Idena afefe"] },
    igbo: { shortDesc: "Anyi na-emeputa ihe owuwu siri ike maka ulo gi.", deliverables: ["Nyocha FEA", "Nhazi igwe siri ike", "Nhazi nkwonkwo", "Nguzogide ikuku"] },
    hausa: { shortDesc: "Muna tsara kashin ginin gidanku.", deliverables: ["Nazarin FEA", "Tsarin karfe", "Injiniyan gidaje", "Karfin iska"] }
  },
  substructure: {
    id: "substructure", title: "Geotechnical & Substructure", subtitle: "Soil Mechanics & Deep Foundations", icon: Compass,
    english: { shortDesc: "We design deep underground support piles so your house never sinks.", deliverables: ["Deep Pile Foundation", "Waterproofing", "Concrete Raft", "Soil Pressure"] },
    pidgin: { shortDesc: "We dey study ground well-well so building no go sink.", deliverables: ["Deep pile plan", "Waterproofing", "Raft foundation", "Soil test"] },
    yoruba: { shortDesc: "A n se apere ipile ti o jin.", deliverables: ["Ipile ti o jin", "Waterproofing", "Raft foundation", "Ayewo ile"] },
    igbo: { shortDesc: "Anyi na-emeputa ntọala miri emi.", deliverables: ["Ntọala miri emi", "Waterproofing", "Raft foundation", "Nyocha ala"] },
    hausa: { shortDesc: "Muna tsara ginshikin kasa.", deliverables: ["Ginshiki mai zurfi", "Waterproofing", "Raft foundation", "Gwajin kasa"] }
  },
  infrastructure: {
    id: "infrastructure", title: "Infrastructure & Hydraulics", subtitle: "Drainage Systems & Pavement Design", icon: Droplet,
    english: { shortDesc: "We layout heavy civil structures, drains, and pavements.", deliverables: ["Site Drainage", "Asphalt Roads", "Runoff Modeling", "Culverts"] },
    pidgin: { shortDesc: "We dey design main gutters and road to block flood.", deliverables: ["Gutters blueprint", "Concrete road", "Culverts", "Flood control"] },
    yoruba: { shortDesc: "A n se apere awon ona omi.", deliverables: ["Ona omi", "Ona asphalt", "Ayewo omi", "Culverts"] },
    igbo: { shortDesc: "Anyi na-emeputa ihe eji eme mmiri.", deliverables: ["Ọwa mmiri", "Okporo ụzọ asphalt", "Nyocha mmiri", "Culverts"] },
    hausa: { shortDesc: "Muna tsara tsarin magudanar ruwa.", deliverables: ["Magudanar ruwa", "Hanyar kwalta", "Binciken ruwa", "Culverts"] }
  },
  retaining: {
    id: "retaining", title: "Retaining & Earth Structures", subtitle: "Shoreline protection & Basements", icon: Anchor,
    english: { shortDesc: "We design structures to hold back massive earth loads.", deliverables: ["Shoreline Protection", "Basement Shoring", "Retaining Walls", "Slope Stability"] },
    pidgin: { shortDesc: "We dey design heavy wall to hold back water.", deliverables: ["Shoreline defense", "Deep shoring", "Cantilever walls", "Landslide prev."] },
    yoruba: { shortDesc: "A n se apere odi lati da ile duro.", deliverables: ["Idabobo eti odo", "Basement shoring", "Odi idaduro", "Slope stability"] },
    igbo: { shortDesc: "Anyi na-emeputa mgbidi iji kwado ala.", deliverables: ["Nchedo oke osimiri", "Basement shoring", "Mgbidi nkwado", "Slope stability"] },
    hausa: { shortDesc: "Muna tsara ganuwar rike kasa.", deliverables: ["Kariyar bakin teku", "Basement shoring", "Ganuwar rike kasa", "Slope stability"] }
  },
  forensics: {
    id: "forensics", title: "Forensic Audit & Retrofitting", subtitle: "Integrity Assessment & Repairs", icon: ShieldCheck,
    english: { shortDesc: "We run advanced technical checkups on old buildings.", deliverables: ["Concrete Scan", "Defect Repair", "Carbon Wrapping", "Rust Treatment"] },
    pidgin: { shortDesc: "We dey run scanner check on old buildings to fix am.", deliverables: ["Concrete scan", "Crack repair", "Carbon wrap", "Rust treatment"] },
    yoruba: { shortDesc: "A n se ayewo lori awon ile atijọ.", deliverables: ["Concrete scan", "Atunse", "Carbon wrapping", "Rust treatment"] },
    igbo: { shortDesc: "Anyi na-eme nnyocha na ụlọ ndị ochie.", deliverables: ["Concrete scan", "Mmezi", "Carbon wrapping", "Rust treatment"] },
    hausa: { shortDesc: "Muna duba tsofaffin gine-gine.", deliverables: ["Concrete scan", "Gyara", "Carbon wrapping", "Rust treatment"] }
  }
};

export default function StructuralSolutions() {
  const [activeTab, setActiveTab] = useState<keyof typeof disciplines>("superstructure");
  const [lang, setLang] = useState<typeof languages[number]>("english");
  const [modalOpen, setModalOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const current = disciplines[activeTab];

  const handleCardClick = (key: keyof typeof disciplines) => {
    setActiveTab(key);
    setModalOpen(true);
    setHintVisible(false);
  };

  // Generate inquiry content based on active discipline and language
  const inquiryEmail = "info@yetosol.com";
  const inquiryPhone = "+2347039171254";
  const emailSubject = `Inquiry: ${current.title} (${lang.toUpperCase()})`;
  const emailBody = `Hello Yetosol,%0D%0A%0D%0AI am interested in your "${current.title}" service.%0D%0A%0D%0APlease provide more information about:%0D%0A${current[lang].deliverables.map((d, i) => `${i + 1}. ${d}`).join("%0D%0A")}%0D%0A%0D%0AThank you.`;
  const whatsappMessage = `Hello Yetosol, I am interested in your "${current.title}" service. Please provide more information.`;

  return (
    <section className="relative bg-slate-100 py-16 md:py-24 overflow-hidden font-sans antialiased">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header – centered on all screens */}
        <div className="flex flex-col items-center gap-6 border-b border-slate-200 pb-6 mb-8 sm:pb-8 sm:mb-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 rounded-full mb-3">
              <HardHat className="h-3 w-3 text-sky-650 shrink-0" />
              <span className="text-[9px] font-black tracking-[0.2em] text-sky-850 uppercase">Engineering Console</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-slate-900 uppercase leading-tight">
              COMPREHENSIVE <br />
              <span className="text-sky-650">STRUCTURAL SOLUTIONS</span>
            </h2>
          </div>
          {/* Language Selector – centered */}
          <div className="relative inline-block w-44">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof languages[number])}
              className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase py-3 px-4 rounded-full cursor-pointer hover:border-sky-300 transition-all text-center"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: Discipline Selector + Stats */}
          <div className="bg-white border border-black/5 shadow-sm rounded-3xl p-4 sm:p-5 flex flex-col space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Disciplines</h4>
            <div className="space-y-1 flex-1">
              {Object.entries(disciplines).map(([key, item]) => {
                const isActive = activeTab === key;
                const Icon = item.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        handleCardClick(key as keyof typeof disciplines);
                      } else {
                        setActiveTab(key as keyof typeof disciplines);
                        setModalOpen(false);
                      }
                    }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-3",
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                      isActive ? "bg-sky-500 border-sky-400 text-white" : "bg-slate-100 border-slate-200 text-slate-500"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold truncate">{item.title}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                  </button>
                );
              })}
            </div>
            {/* Mobile hint pill */}
            {hintVisible && (
              <div className="md:hidden mt-3 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-full text-[10px] font-bold text-yellow-800 uppercase tracking-wider animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
                  Tap a service to explore details
                </div>
              </div>
            )}
            {/* Small stats inside the selector card */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-sky-50 rounded-xl p-2 text-center">
                  <p className="text-lg font-black text-sky-600">150+</p>
                  <p className="text-[9px] font-bold text-sky-700 uppercase tracking-wider">Projects</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-2 text-center">
                  <p className="text-lg font-black text-amber-600">99%</p>
                  <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Satisfaction</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[9px] font-semibold text-slate-500">
                <GitCommit className="w-3 h-3 text-amber-500 animate-pulse" />
                Engineered Guarantee
              </div>
            </div>
          </div>

          {/* CARD 2: Main Detail Panel (span 2 columns) */}
          <div className="md:col-span-2 bg-white border border-black/5 shadow-sm rounded-3xl overflow-hidden flex flex-col">
            {/* Header bar */}
            <div className="bg-slate-50/70 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <current.icon className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                    Active Service
                  </span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                    {current.title}
                  </span>
                </div>
              </div>
              <span className="text-[8px] font-mono font-black text-slate-500 border border-slate-200 bg-white px-2 py-0.5 rounded-md flex items-center gap-1">
                <Activity className="h-2.5 w-2.5 text-emerald-500" /> Live
              </span>
            </div>

            {/* Dynamic Content */}
            <div className="p-4 sm:p-6 flex-1 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + lang}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase mb-4">
                    {current.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base italic mb-6 border-l-4 border-yellow-400 pl-4 leading-relaxed">
                    {current[lang].shortDesc}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {current[lang].deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 uppercase">{d}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer CTA – opens inquiry modal */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInquiryOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-slate-800 transition-colors shadow-sm"
              >
                Inquire Now <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3: Your Team (span 1) */}
          <div className="bg-white border border-black/5 shadow-sm rounded-3xl p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Our Team</h4>
            <div className="flex -space-x-3 mb-4">
              <img src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/onayemi_fgtdjr.webp" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/Aromiwura_gjimoc.webp" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/Adeleye_wqniyt.webp" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">+5</div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Certified COREN engineers assigned to every project.
            </p>
          </div>

          {/* CARD 4: Phases at a Glance (span 2) */}
          <div className="md:col-span-2 bg-white border border-black/5 shadow-sm rounded-3xl p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Phases at a Glance</h4>
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {current[lang].deliverables.map((d, i) => (
                <div key={i} className="flex-1 min-w-[80px] text-center">
                  <div className="w-3 h-3 rounded-full bg-sky-500 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-slate-700 uppercase leading-tight break-words">
                    {d.length > 25 ? d.substring(0, 22) + '…' : d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Inquiry Modal ── */}
      <AnimatePresence>
        {inquiryOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInquiryOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setInquiryOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-yellow-100 to-sky-100 mb-4">
                  <current.icon className="h-7 w-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">{current.title}</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">
                  {lang.toUpperCase()} Inquiry
                </p>
              </div>

              <div className="space-y-3">
                {/* Email Option */}
                <a
                  href={`mailto:${inquiryEmail}?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-yellow-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <Mail className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">Send Email</p>
                    <p className="text-xs text-gray-500">info@yetosol.com</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                </a>

                {/* WhatsApp Option */}
                <a
                  href={`https://wa.me/${inquiryPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
                    <p className="text-xs text-gray-500">Fastest response</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </a>

                {/* Phone Option */}
                <a
                  href={`tel:${inquiryPhone}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-sky-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                    <Phone className="h-6 w-6 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">Call Now</p>
                    <p className="text-xs text-gray-500">{inquiryPhone}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-sky-600 transition-colors" />
                </a>
              </div>

              <p className="text-[10px] text-gray-400 text-center mt-5">
                Available Monday – Friday, 8:00 AM – 6:00 PM
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Modal (service detail) ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto lg:hidden"
          >
            <button onClick={() => setModalOpen(false)} className="mb-8 p-2 bg-slate-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-4xl font-black uppercase mb-6">{current.title}</h3>
            <p className="text-slate-600 text-lg mb-8 italic border-l-4 border-yellow-400 pl-4">
              {current[lang].shortDesc}
            </p>
            <div className="space-y-3">
              {current[lang].deliverables.map((d, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl font-bold uppercase text-xs">
                  {d}
                </div>
              ))}
            </div>
            <div className="fixed bottom-6 left-6 right-6 space-y-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setInquiryOpen(true);
                }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase"
              >
                Inquire About This Service
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold uppercase"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}