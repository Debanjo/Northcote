"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Phone, Mail, X } from "lucide-react";

const brand = {
  yellow: "#F5A623",
  skyBlue: "#4A90E2",
};

/* ── Services data with specific contact categories ── */
const features = [
  {
    title: "Custom Residential",
    desc: "Tailored homes built to your exact specifications, blending luxury with structural integrity.",
    bg: `linear-gradient(135deg, ${brand.yellow}, #FBBF24)`,
    isDarkBg: true,
    category: "Residential Project",
    visual: (
      <div className="absolute right-[-10px] bottom-[-20px] w-36 h-36 opacity-95 pointer-events-none">
        <div className="absolute bottom-5 right-8 w-8 h-24 bg-white rounded-[40%] rotate-[-15deg] shadow-lg">
          <div className="w-full h-2 bg-yellow-400 absolute top-5" />
        </div>
        <div className="absolute bottom-2 right-[70px] w-9 h-28 bg-white rounded-[40%] rotate-[5deg] shadow-lg">
          <div className="w-full h-2 bg-yellow-400 absolute top-5" />
        </div>
      </div>
    ),
  },
  {
    title: "Commercial Builds",
    desc: "Office towers, retail spaces, and industrial facilities designed for efficiency and scale.",
    bg: "#FFFFFF",
    isDarkBg: false,
    category: "Commercial Project",
    visual: (
      <div className="absolute right-[-15px] bottom-[-20px] w-40 h-36 pointer-events-none">
        <div className="w-20 h-24 bg-gray-900 rounded-lg rotate-[-25deg] absolute right-8 bottom-5 shadow-lg">
          <div className="w-24 h-8 bg-gray-700 rounded-full absolute -top-3 -left-1 border-2 border-gray-500" />
          <div className="w-12 h-20 bg-gray-400 rounded-2xl absolute -top-2 -left-7 rotate-[15deg] shadow-md" />
        </div>
      </div>
    ),
  },
  {
    title: "Civil Engineering",
    desc: "Roads, drainage, and infrastructure projects built to withstand decades of service.",
    bg: "#FFFFFF",
    isDarkBg: false,
    category: "Civil Works",
    visual: (
      <div className="absolute right-[-15px] bottom-[-30px] w-40 h-36 pointer-events-none rotate-[-10deg]">
        <div className="w-16 h-16 bg-gray-900 rounded-full absolute right-10 bottom-12 skew-y-[-10deg] z-10">
          <div className="w-14 h-14 bg-gray-500 rounded-full m-1" />
        </div>
        <div className="w-20 h-14 bg-gray-800 absolute right-16 bottom-14 clip-path-polygon" />
        <div className="w-5 h-10 bg-gray-400 rounded absolute right-20 bottom-8 rotate-[15deg]" />
      </div>
    ),
  },
  {
    title: "Consulting & Design",
    desc: "Expert feasibility studies, architectural planning, and project management from day one.",
    bg: `linear-gradient(135deg, ${brand.skyBlue}, #2563EB)`,
    isDarkBg: true,
    category: "Consulting",
    visual: (
      <div className="absolute right-[-30px] bottom-[-40px] w-44 h-40 pointer-events-none">
        <div className="w-28 h-40 bg-white rounded-t-2xl rotate-[-15deg] translate-y-5 absolute right-5 shadow-xl flex items-center justify-center gap-1 p-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full border-2 border-sky-500" />
          ))}
        </div>
      </div>
    ),
  },
];

/* ── Contact Modal Component ── */
function ContactModal({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  const email = "info@yetosol.com";
  const phone = "+234 703 917 1254";
  const whatsappUrl = `https://wa.me/2347039171254?text=Hello%20Yetosol,%20I'm%20interested%20in%20${encodeURIComponent(category)}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-sm w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Category badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-1.5 rounded-full mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-800">{category}</span>
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-2">Let's Discuss</h3>
        <p className="text-gray-500 text-sm mb-8">Our team is ready to help with your {category.toLowerCase()}. Reach out directly.</p>

        {/* Contact options */}
        <div className="space-y-4">
          {/* Email */}
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(category)} Inquiry`}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-yellow-50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <Mail className="h-6 w-6 text-yellow-700" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">Send Email</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
          </a>

          {/* Phone */}
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-sky-50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
              <Phone className="h-6 w-6 text-sky-700" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">Call Now</p>
              <p className="text-xs text-gray-500">{phone}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-sky-600 transition-colors" />
          </a>

          {/* WhatsApp (optional but convenient) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Phone className="h-6 w-6 text-green-700" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
              <p className="text-xs text-gray-500">Fastest response</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </a>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-6">
          Available Monday – Friday, 8:00 AM – 6:00 PM
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Section ── */
export default function ReadyToStart() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section className="relative bg-[#F3F4F6] py-20 sm:py-28 overflow-hidden font-sans antialiased">
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-yellow-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-800">Get Started</span>
          </div>
          <h2 className="text-[clamp(1.75rem,5vw,4rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            Ready to Start ?
          </h2>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to bring your vision to life, from initial sketches to final handover. Select a service to begin.
          </p>
        </motion.div>

        {/* ── Feature Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div
                className="relative rounded-[24px] p-6 sm:p-8 h-auto sm:h-[280px] min-h-[260px] flex flex-col justify-between overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-xl"
                style={{
                  background: feature.bg,
                  border: feature.isDarkBg ? "none" : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {/* Text content */}
                <div className="max-w-[65%] sm:max-w-[60%] z-10">
                  <h3
                    className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 ${feature.isDarkBg ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${feature.isDarkBg ? "text-white/80" : "text-gray-500"
                      }`}
                  >
                    {feature.desc}
                  </p>
                </div>

                {/* Abstract visual illustration */}
                {feature.visual}

                {/* Inquire Now button (replaces Learn More) */}
                <button
                  onClick={() => setActiveCategory(feature.category)}
                  className="inline-flex items-center gap-2 mt-auto cursor-pointer group/btn z-20 relative"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-110 shadow-md ${feature.isDarkBg ? "bg-white" : "bg-gray-900"
                      }`}
                  >
                    <ArrowUpRight
                      className={`w-5 h-5 ${feature.isDarkBg ? "text-gray-900" : "text-white"}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold uppercase tracking-widest ${feature.isDarkBg ? "text-white" : "text-gray-700"
                      }`}
                  >
                    Inquire Now
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Contact Modal ── */}
      <AnimatePresence>
        {activeCategory && (
          <ContactModal
            category={activeCategory}
            onClose={() => setActiveCategory(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}