// northcote-ui/app/routes/LandingPage.tsx
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Hero from "@/components/landing/Hero";
import ValuesSection from "@/components/landing/ValuesSection";
import HistorySection from "@/components/landing/HistorySection";
import Services from "@/components/landing/Services";
import TeamSection from "@/components/landing/TeamSection";
import GovernanceSection from "@/components/landing/GovernanceSection";
import DetailedProjects from "@/components/landing/DetailedProjects";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import MaterialsPriceTracker from "@/components/landing/MaterialsPriceTracker";
import ProjectTimeline from "@/components/landing/ProjectTimeline";
import SafetyChecklist from "@/components/landing/SafetyChecklist";
import CostEstimator from "@/components/landing/CostEstimator";
import TrustedPartners from "@/components/landing/TrustedPartners";

export function meta() {
  return [
    { title: "Yetosol – Building Dreams Into Reality" },
    { name: "description", content: "Leading construction company delivering excellence in residential, commercial, and industrial projects." }
  ];
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== DYNAMIC FLOATING PILL NAVIGATION ==================== */}
      <div
        className={`sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300 ease-in-out transform ${isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
          }`}
      >
        <nav className="max-w-7xl mx-auto bg-white/85 backdrop-blur-md border border-gray-200/80 shadow-lg rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784851531/logo__z7qp82.png"
              alt="Yetosol Associates"
              className="h-28 sm:h-30 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 bg-gray-50/80 border border-gray-100 rounded-full p-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className="rounded-full px-5 py-3 text-m font-semibold text-gray-700 transition-colors hover:bg-yellow-500 hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#cost-estimator"
              className="inline-flex items-center justify-center rounded-full border border-sky-400 bg-sky-100 px-5 py-3 text-m font-bold text-sky-800 transition-all hover:bg-sky-200 animate-pulse-custom"
            >
              AI COST ESTIMATOR
            </a>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center rounded-full border border-yellow-400 bg-yellow-400 px-5 py-3 text-m font-bold text-black transition-colors hover:bg-yellow-500"
            > 
              Get Started
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-black" />
            ) : (
              <Menu className="h-5 w-5 text-black" />
            )}
          </button>
        </nav>
      </div>

      {/* ==================== MOBILE GLASSMORPHISM BOTTOM SHEET ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-t-3xl p-6 overflow-y-auto max-h-[85vh]"
            >
              {/* Logo & Close */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <img
                    src="https://res.cloudinary.com/ami1jzfj/image/upload/v1784851531/logo__z7qp82.png"
                    alt="Yetosol"
                    className="h-20 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3 mb-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-full px-6 py-3.5 text-base font-bold text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all text-center border border-transparent hover:border-yellow-200"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#cost-estimator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-full border border-sky-400 bg-sky-100 px-6 py-3.5 text-base font-bold text-sky-800 hover:bg-sky-200 transition-all text-center animate-pulse-custom"
                >
                  AI COST ESTIMATOR
                </a>
              </div>

              {/* Get Started Button */}
              <Button
                asChild
                className="w-full rounded-full bg-yellow-400 text-black hover:bg-yellow-300 py-6 text-lg font-bold shadow-md"
              >
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>

              {/* Bottom accent bar */}
              <div className="mt-6 flex justify-center">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-sky-400" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="mt-4">
        <div id="home"><Hero /></div>
        <div id="about">
          <TrustedPartners />
          <ValuesSection />
          <HistorySection />
        </div>
        <div id="services"><Services /></div>
        <div id="cost-estimator"><CostEstimator /></div>
        <div id="projects"><DetailedProjects /></div>
        <MaterialsPriceTracker />
        <ProjectTimeline />
        <GovernanceSection />
        <div id="team"><TeamSection /></div>
        <Testimonials />
        <SafetyChecklist />
        <FAQ />
        <div id="contact"><Contact /></div>
      </main>

      <Footer />
    </div>
  );
}