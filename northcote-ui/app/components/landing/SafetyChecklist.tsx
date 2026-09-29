"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  Download,
  Loader2,
  HardHat,
  Heart,
  Eye,
  Star,
} from "lucide-react";

const safetyItems = [
  "Hard hats worn at all times",
  "Safety boots & reflective vests",
  "Scaffolding inspected daily",
  "Fire extinguishers accessible",
  "First aid kit on site",
  "Toolbox talks conducted weekly",
  "Emergency exits clearly marked",
  "Noise & dust control measures",
];

export default function SafetyPledge() {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(safetyItems.length).fill(false)
  );
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allChecked = checked.every((v) => v);
  const completedCount = checked.filter((v) => v).length;
  const progressPercent = Math.round((completedCount / safetyItems.length) * 100);

  const handleCheck = (idx: number) => {
    const newChecked = [...checked];
    newChecked[idx] = !newChecked[idx];
    setChecked(newChecked);

    if (newChecked.every((v) => v) && !badgeEarned) {
      setBadgeEarned(true);
      setTimeout(() => setModalOpen(true), 800);
    }
  };

  const handleDownload = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Trigger PDF download
    const link = document.createElement("a");
    link.href = "/YETOSOL_PROFILE.pdf";
    link.download = "YETOSOL_PROFILE.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setModalOpen(false);
    setFormData({ name: "", email: "" });
    setIsSubmitting(false);
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-yellow-50/20 to-white py-24 sm:py-32 overflow-hidden font-sans antialiased">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-yellow-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-800">
              Our Promise
            </span>
          </div>
          <h2 className="text-[clamp(1.95rem,5vw,4rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            The Yetosol <span className="text-yellow-600">Pledge</span>
          </h2>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Safety isn't a checkbox, it's our foundation. Review our protocols below and earn your Safety Champion badge.
          </p>
        </motion.div>

        {/* Main interactive card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 overflow-hidden"
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-6 right-6 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-sky-400 to-yellow-400 opacity-80" />

          {/* Progress ring + count */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8">
            {/* Circular progress */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="6" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={allChecked ? "#10B981" : "#F5A623"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 42 * (1 - progressPercent / 100),
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
              <div className="relative flex flex-col items-center">
                <span className="text-2xl font-black text-gray-900">{progressPercent}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {completedCount}/{safetyItems.length}
                </span>
              </div>
            </div>

            {/* Status text */}
            <div className="flex-1 text-left">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                {allChecked
                  ? "🎉 Safety Champion Unlocked!"
                  : completedCount === 0
                    ? "Begin Your Safety Review"
                    : "Keep Going—Almost There!"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {allChecked
                  ? "You've reviewed all our safety protocols. Download the full company profile now."
                  : "Tap each safety standard to confirm your review. Complete all to unlock the company brochure."}
              </p>
            </div>
          </div>

          {/* Checklist grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {safetyItems.map((item, idx) => {
              const isChecked = checked[idx];
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleCheck(idx)}
                  whileTap={{ scale: 0.97 }}
                  className={`group flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${isChecked
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-white border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50"
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 transition-all duration-300 ${isChecked
                      ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                      : "bg-gray-100 text-gray-400 group-hover:bg-yellow-100 group-hover:text-yellow-600"
                      }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <div className="w-3 h-3 rounded-none border-2 border-current" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${isChecked ? "text-green-800" : "text-gray-700 group-hover:text-gray-900"
                      }`}
                  >
                    {item}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Floating safety icons (decorative) */}
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-yellow-100/50 blur-xl pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-sky-100/50 blur-lg pointer-events-none" />
        </motion.div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            <span>ISO 45001 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-sky-600" />
            <span>Zero Critical Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span>200+ Lives Protected Daily</span>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full mx-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Decorative top bar */}
              <div className="absolute top-0 left-6 right-6 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-sky-400 opacity-80" />

              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 mb-4 shadow-lg"
                >
                  <Star className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900">Safety Champion!</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your details to download the complete Yetosol corporate profile.
                </p>
              </div>

              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download PDF
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}