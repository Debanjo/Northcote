"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";

/* ── Brand Colors ── */
const brand = {
  yellow: "#F5A623",
  skyBlue: "#4A90E2",
};

/* ── Link data structured like the reference ── */
const linkGroups = [
  {
    columns: [
      {
        header: "Services",
        links: [
          "Building Construction",
          "Civil Works",
          "Facility Management",
          "Redevelopment",
          "Consulting",
          "Cost Estimator",
        ],
      },
      {
        header: "Projects",
        links: [
          "Residential",
          "Commercial",
          "Industrial",
          "Infrastructure",
          "Portfolio",
        ],
      },
    ],
  },
  {
    columns: [
      {
        header: "Company",
        links: [
          "About Yetosol",
          "Our Team",
          "Careers",
          "Partners",
          "Press Kit",
          "Success Stories",
        ],
      },
      {
        header: "Resources",
        links: [
          "FAQ",
          "Project Timeline",
          "Material Prices",
          "Safety Policy",
          "Blog",
        ],
      },
    ],
  },
  {
    columns: [
      {
        header: "Contact",
        links: [
          "info@yetosol.com",
          "+234 703 917 1254",
          "24/28 Strachan Street, Lagos",
          "Request Quote",
          "Schedule Visit",
        ],
      },
      {
        header: "Legal",
        links: [
          "Privacy Policy",
          "Terms of Use",
          "Cookie Policy",
          "Modern Slavery Statement",
          "Supplier Code",
        ],
      },
    ],
  },
  {
    columns: [
      {
        header: "Social",
        links: ["LinkedIn", "Instagram", "Twitter / X"],
      },
      {
        header: "More",
        links: ["Client Portal", "Employee Portal", "Newsletter", "Sitemap"],
      },
    ],
  },
];

/* ── Small info modal ── */
function InfoModal({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-xs w-full mx-4 relative text-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-4">
          <Sparkles className="h-7 w-7 text-yellow-600" />
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2">{label}</h4>
        <p className="text-sm text-gray-500">
          More details about {label} will be available soon. Feel free to contact us for immediate assistance.
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Footer() {
  const [language, setLanguage] = useState("English");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <footer
      className="relative text-white font-sans antialiased overflow-hidden"
      style={{ backgroundColor: "#1C1F22" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* ── Top Utility Ribbon ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/10">
          {/* Support links */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
            <span className="text-sm font-bold text-white">How can we help?</span>
            {["Contact us", "Help center", "Site status"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveModal(item)}
                className="text-sm text-white/70 hover:text-white transition-colors text-left"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { icon: Linkedin, href: "https://linkedin.com/company/yetosol" },
              { icon: TwitterX, href: "https://twitter.com/yetosol" },
              { icon: Instagram, href: "https://instagram.com/yetosol_associates" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: brand.skyBlue, color: "#fff" }}
                aria-label={social.href}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* CTA + language */}
          <div className="flex gap-3 w-full sm:w-auto">
            <a
              href="tel:+2347039171254"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: brand.yellow, color: "#1C1F22" }}
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-transparent border border-white/20 rounded-full px-4 py-2 pr-8 text-sm font-medium text-white cursor-pointer focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Français">Français</option>
                <option value="Español">Español</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Link Directory ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {linkGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-6">
              {group.columns.map((col, colIdx) => (
                <div key={colIdx}>
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                    {col.header}
                  </h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <button
                          onClick={() => setActiveModal(link)}
                          className="text-sm font-medium text-white/80 hover:text-white hover:underline transition-colors text-left"
                        >
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Brand Watermark – Full screen on mobile ── */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[13vw] md:text-[14.5vw] font-black leading-none tracking-tighter select-none pointer-events-none whitespace-nowrap px-14"
          style={{
            background: `linear-gradient(135deg, ${brand.yellow}, ${brand.skyBlue})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Y E T O S O L .
        </motion.div>
      </div>

      {/* ── Bottom Compliance Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-white/10">
          <span className="text-xs text-white/40 font-medium">
            © {new Date().getFullYear()} Yetosol Associates. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {[
              "Legal",
              "Trust center",
              "Privacy policy",
              "Cookies policy",
              "Modern slavery act statement",
              "Supplier code of conduct",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveModal(item)}
                className="text-xs text-white/40 hover:text-white hover:underline transition-colors text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-white/40 text-center mt-4">
          Built by <a href="https://xkwisit.agency" target="_blank" rel="noopener noreferrer" 
          className="text-yellow-500 hover:underline">XKWISIT SERVICES</a>
        </p>
      </div>


      {/* ── Info Modal (appears on any link click) ── */}
      <AnimatePresence>
        {activeModal && (
          <InfoModal label={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </footer>
  );
}

/* Inline X (Twitter) icon */
function TwitterX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}