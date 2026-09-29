"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Scale,
  Users,
  Heart,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  TrendingUp,
  HardHat,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ── Safety images (auto‑sliding) ── */
const safetyImages = [
  "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867449/group_oqacco.jpg",
  "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/group2_kozahn.jpg",
  "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867450/group3_yf9vlg.jpg",
];

/* ── Company Policies (paginated) ── */
const companyPolicies = [
  {
    title: "Quality Policy",
    description:
      "We are committed to delivering projects of the highest quality by adhering to international standards, continuous improvement, and customer-focused execution. Every project undergoes rigorous quality checks at every phase.",
    icon: Shield,
  },
  {
    title: "Health & Safety Policy",
    description:
      "We provide a safe and healthy work environment for all employees, contractors, and visitors. We comply with and exceed all applicable HSE laws, conduct regular safety training, and maintain a zero‑incident target.",
    icon: HardHat,
  },
  {
    title: "Environmental Policy",
    description:
      "We minimize our environmental footprint by using sustainable materials, reducing waste, and preventing pollution. Our operations are designed to protect the environment for future generations.",
    icon: Heart,
  },
  {
    title: "Ethics & Compliance",
    description:
      "We conduct business with integrity, fairness, and transparency. We adhere to all legal and regulatory requirements, and we expect the same from our partners and suppliers.",
    icon: Scale,
  },
];

/* ── Brand tokens ── */
const brand = {
  yellow: "#F5A623",
  skyBlue: "#4A90E2",
};

/* ── Circular Progress Ring Component (unchanged) ── */
function CircularProgress({
  percent,
  label,
  subtitle,
  color = brand.skyBlue,
}: {
  percent: number;
  label: string;
  subtitle: string;
  color?: string;
}) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-gray-900">{percent}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ── Stagger animations ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function GovernanceDashboard() {
  const [currentImage, setCurrentImage] = useState(0);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyPage, setPolicyPage] = useState(0);

  // Auto‑advance the safety image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % safetyImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentPolicy = companyPolicies[policyPage];
  const totalPolicyPages = companyPolicies.length;

  const goToNextPolicy = () =>
    setPolicyPage((prev) => (prev + 1) % totalPolicyPages);
  const goToPrevPolicy = () =>
    setPolicyPage((prev) => (prev - 1 + totalPolicyPages) % totalPolicyPages);

  return (
    <section className="relative bg-slate-50 py-20 sm:py-28 overflow-hidden font-sans antialiased">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-sky-100/30 blur-[130px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-yellow-100/30 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-1.5 rounded-full mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              Our Governance
            </span>
          </div>
          <h2 className="text-[clamp(1.95rem,5vw,4rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            Ethical <span className="text-yellow-600">Excellence</span>
          </h2>
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            We manage for profitable long‑term growth with efficiency and
            quality. Good corporate governance is critical to business success,
            conducted with global best practices.
          </p>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* CARD 1: Hero Governance (span 2 columns) – sky‑blue gradient */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl"
          >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full inline-block mb-4">
                Foundation of Trust
              </span>
              <h3 className="text-3xl sm:text-4xl font-black mb-4">
                Built on a Foundation of Trust
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg mb-6">
                We conduct business with the highest ethical standards, ensuring
                safety, quality, and integrity in every project we deliver.
              </p>

              {/* Avatar Stack (team representation) */}
              <div className="flex -space-x-3 mb-6">
                {[
                  "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/onayemi_fgtdjr.webp",
                  "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/Aromiwura_gjimoc.webp",
                  "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/Adeleye_wqniyt.webp",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-12 h-12 rounded-full border-[3px] border-sky-500 object-cover"
                    alt="Team"
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-[3px] border-sky-500 bg-sky-400 flex items-center justify-center text-xs font-black text-white">
                  +5
                </div>
              </div>

              {/* CTA Button – opens policy modal */}
              <button
                onClick={() => setPolicyModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-sky-600 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-sky-50 transition-all hover:scale-105"
              >
                View Our Policies <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* CARD 2: Circular Progress (Years of Safety) */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-black/5 shadow-sm rounded-[32px] p-6 flex flex-col items-center justify-center"
          >
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
              Safety Record
            </h4>
            <CircularProgress
              percent={100}
              label="Incident-Free"
              subtitle="Zero Critical"
              color={brand.yellow}
            />
            <p className="text-sm font-bold text-gray-900 mt-4">15+ Years</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              Zero Critical Incidents
            </p>
          </motion.div>

          {/* CARD 3: Pillars – Safety & Standards */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-black/5 shadow-sm rounded-[32px] p-5 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-50 flex items-center justify-center">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Safety</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Injury‑free workplace
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 mt-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center">
                <Scale className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Standards</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Premium quality
                </p>
              </div>
            </div>
          </motion.div>

          {/* CARD 4: Pillars – Ethics & Integrity */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-black/5 shadow-sm rounded-[32px] p-5 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-violet-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Ethics</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  True sincerity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 mt-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Integrity</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Fairness always
                </p>
              </div>
            </div>
          </motion.div>

          {/* CARD 5: Image Slider / Policy Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-black/5 shadow-sm rounded-[32px] overflow-hidden"
          >
            <div className="relative aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  src={safetyImages[currentImage]}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {safetyImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentImage
                      ? "bg-yellow-400 w-7"
                      : "bg-white/60 hover:bg-white"
                      }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-black text-gray-900 text-sm mb-1">Safety in Action</h4>
              <p className="text-xs text-gray-500 font-medium">
                Our teams uphold the highest safety standards on every site.
              </p>
            </div>
          </motion.div>

          {/* CARD 6: Key Metrics (bottom row full-width) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-3 bg-white border border-black/5 shadow-sm rounded-[32px] p-6"
          >
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Our Impact
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: TrendingUp, label: "Projects", value: "150+", color: "text-sky-600" },
                { icon: HardHat, label: "Engineers", value: "25+", color: "text-amber-600" },
                { icon: Clock, label: "Years", value: "18+", color: "text-emerald-600" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-4 bg-gray-50 rounded-2xl"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Policy Modal (paginated, responsive) ── */}
      <AnimatePresence>
        {policyModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPolicyModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Accent bar */}
              <div className="absolute top-0 left-6 right-6 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-sky-400 to-yellow-400 opacity-80" />

              {/* Close button */}
              <button
                onClick={() => setPolicyModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={policyPage}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                        <currentPolicy.icon className="h-6 w-6 text-sky-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">
                        {currentPolicy.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {currentPolicy.description}
                    </p>

                    {/* Policy checklist (generic) */}
                    <ul className="space-y-2">
                      {[
                        "Regularly reviewed and updated",
                        "Aligned with international standards",
                        "Communicated to all employees",
                        "Monitored for compliance",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="h-4 w-4 text-yellow-600 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                {/* Pagination controls */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                  <button
                    onClick={goToPrevPolicy}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="Previous policy"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <span className="text-sm font-mono font-bold text-gray-400">
                    {policyPage + 1} / {totalPolicyPages}
                  </span>
                  <button
                    onClick={goToNextPolicy}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="Next policy"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}