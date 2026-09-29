"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const brand = {
  yellow: "#F5A623",
  skyBlue: "#4A90E2",
};

const faqs = [
  {
    tag: "Services",
    question: "What types of construction projects does Yetosol handle?",
    answer:
      "We handle residential, commercial, industrial, and infrastructure projects of all sizes, from single‑family homes to large‑scale civil works. Our expertise spans building construction, facility management, civil engineering, and strategic consulting.",
  },
  {
    tag: "Process",
    question: "How can I request a quote or consultation?",
    answer:
      "Simply fill out the contact form on our website, call us directly, or email us at info@yetosol.com. We’ll respond within 24 hours to schedule a free consultation and discuss your project’s needs.",
  },
  {
    tag: "Timeline",
    question: "What is the typical timeline for a construction project?",
    answer:
      "Timelines vary based on project scope, but we provide a detailed schedule with milestones after the initial consultation. A standard residential project may take 16‑24 weeks, while larger commercial builds can span several months to a year.",
  },
  {
    tag: "Design",
    question: "Do you handle both design and construction?",
    answer:
      "Yes, we offer integrated design‑build services to streamline the entire process. Alternatively, we can work with your existing architects and engineers to ensure seamless execution.",
  },
  {
    tag: "Coverage",
    question: "What areas do you serve?",
    answer:
      "We primarily serve Nigeria, with projects across Lagos, Abuja, and other major cities. Our team has experience delivering projects nationwide and can accommodate remote consultations.",
  },
  {
    tag: "Assurance",
    question: "Are your services insured and guaranteed?",
    answer:
      "Absolutely. We carry comprehensive insurance and provide warranties on our workmanship. All projects are backed by our commitment to quality and safety.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const cycleNext = () => setActiveIndex((prev) => (prev + 1) % faqs.length);

  return (
    <section className="relative bg-[#F9FAFB] py-20 sm:py-28 overflow-hidden font-sans antialiased">
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-yellow-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-800">Frequently Asked</span>
          </div>
          <h2 className="text-[clamp(1.75rem,5vw,4rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            Your FAQs, <span className="text-sky-600"> Answered</span>
          </h2>
        </motion.div>

        {/* Blue container – full width on mobile, contained on tablet and desktop */}
        <div
          className="
            relative
            w-screen left-1/2 -translate-x-1/2       // full screen on mobile
            md:w-auto md:left-auto md:translate-x-0   // reset on tablet and up
            rounded-none md:rounded-[32px]             // no radius on mobile, rounded on tablet+
            p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl
          "
          style={{ backgroundColor: brand.skyBlue, boxShadow: "0 20px 40px -15px rgba(74,144,226,0.4)" }}
        >
          {/* Subtle background watermark */}
          <span className="absolute -bottom-4 right-4 text-[4rem] sm:text-[8rem] font-black text-white/5 select-none pointer-events-none">
            faq
          </span>

          {/* Grid: stacks on mobile, side‑by‑side on tablet and desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
            {/* LEFT: Stacked Cards Showcase – with extra left padding on tablet+ */}
            <div className="md:col-span-5 flex justify-center md:pl-4">
              <div className="relative w-full max-w-[340px] h-[340px] sm:h-[380px]">
                <AnimatePresence mode="popLayout">
                  {faqs.map((faq, idx) => {
                    const stackOrder = (idx - activeIndex + faqs.length) % faqs.length;
                    if (stackOrder > 2) return null;

                    const rotateZ = stackOrder === 0 ? 0 : stackOrder === 1 ? -4 : -8;
                    const translateX = stackOrder === 0 ? 0 : stackOrder === 1 ? -12 : -24;
                    const translateY = stackOrder === 0 ? 0 : stackOrder === 1 ? 8 : 16;
                    const zIndex = faqs.length - stackOrder;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: translateX,
                          y: translateY,
                          rotateZ: rotateZ,
                          zIndex: zIndex,
                        }}
                        exit={{ opacity: 0, x: -100, rotateZ: -15, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute w-full h-full cursor-pointer"
                        onClick={cycleNext}
                      >
                        <div className="bg-white rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-lg border border-gray-100">
                          <div className="space-y-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
                              {faq.tag}
                            </span>
                            <h4 className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight">
                              {faq.question}
                            </h4>
                            <div className="border-t border-dashed border-gray-200 pt-3">
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 self-end mt-3">
                            Click card to cycle next →
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Question List with active highlight */}
            <div className="md:col-span-7">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center md:text-left">
                  Simplify Your Journey with Yetosol
                </h3>
                <p className="text-white/80 text-sm sm:text-base text-center md:text-left">
                  Got questions? Explore our structured FAQ below to understand our services, process, and commitment to quality.
                </p>
                <div className="space-y-2 mt-6">
                  {faqs.map((faq, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 flex items-center justify-between ${isActive
                          ? "bg-white/15 border border-white/30"
                          : "hover:bg-white/5 border border-transparent"
                          }`}
                      >
                        <span className={`text-sm sm:text-base font-medium ${isActive ? "text-white font-bold" : "text-white/80"
                          }`}>
                          {faq.question}
                        </span>
                        <ChevronRight
                          className={`h-5 w-5 text-white/60 transition-transform duration-200 ${isActive ? "translate-x-1" : ""
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}