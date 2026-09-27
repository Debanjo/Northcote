"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Mr. Babafemi Adetifa",
    content:
      "It was a great experience working with Yetosol Associates. Their professionalism, attention to detail, and commitment to quality stood out throughout the project. They delivered on time and maintained clear communication at every stage. I would highly recommend them for any construction needs.",
    rating: 5.0,
    verified: true,
  },
  {
    id: 2,
    name: "Mr. Edward Ekechukwu",
    content:
      "Engaging the company on a family project has been a worthwhile experience. The level of professionalism, dedication and insight has been good. I strongly recommend them for engagements. Well done to the team.",
    rating: 5.0,
    verified: true,
  },
  {
    id: 3,
    name: "Ms. Zainab A.O",
    content:
      "It was a great experience working with Yetosol Associates. Their consultants are professionals and their service is top-notch.",
    rating: 5.0,
    verified: true,
  },
  {
    id: 4,
    name: "Mr. Olufemi Samuel",
    content:
      "Great services! I have no reservations in recommending the company for anyone.",
    rating: 5.0,
    verified: true,
  },
  {
    id: 5,
    name: "Mr. Oluwaseyi Aloba",
    content:
      "Great business associates, I have done quite a lot of business with the team and can proudly say they are professional.",
    rating: 5.0,
    verified: true,
  },
  {
    id: 6,
    name: "Mr. Femi Dada",
    content:
      "I appreciate the high level of commitment to projects and the drive to achieve practical solutions on projects.",
    rating: 5.0,
    verified: true,
  },
];

export default function ResponsiveTestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Detect mobile screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Hide swipe hint after first interaction or after 3 seconds
  useEffect(() => {
    if (!isMobile) return;
    const timer = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Reset expand state on slide change
  useEffect(() => {
    setExpanded(false);
  }, [selectedIndex]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setShowSwipeHint(false); // hide hint on any navigation
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("pointerDown", () => setShowSwipeHint(false));
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", () => { });
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-32 overflow-hidden font-sans antialiased">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-yellow-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-800">Client Stories</span>
          </div>
          <h2 className="text-[clamp(1.75rem,6vw,4rem)] font-black text-gray-900 uppercase tracking-tight leading-[1.05]">
            Voices of <span className="text-yellow-600">Trust</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Chevrons – larger touch targets on mobile */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-6 z-30 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-6 z-30 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Embla viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, idx) => (
                <div key={t.id} className="flex-[0_0_100%] min-w-0 px-4 sm:px-8">
                  <motion.div
                    layout
                    className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col relative"
                  >
                    {/* Accent bar */}
                    <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-sky-400 to-yellow-400 opacity-80" />

                    {/* Card body with fluid padding */}
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-6">
                      {/* Header: avatar + info + badge */}
                      <div className="flex items-center gap-4">
                        {/* Initials */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-100 to-sky-100 flex items-center justify-center text-xl sm:text-2xl font-black text-yellow-600 border-2 border-yellow-200 shrink-0">
                          {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-base sm:text-lg lg:text-xl truncate">{t.name}</p>
                        </div>
                        {t.verified && (
                          <div className="bg-green-50 text-green-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-sm shrink-0">
                            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Verified
                          </div>
                        )}
                      </div>

                      {/* Rating row */}
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                        ))}
                      </div>

                      {/* Testimonial text */}
                      <div>
                        <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400/20 mb-1.5 sm:mb-2" />
                        <motion.p
                          layout
                          className={`text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed ${isMobile && !expanded ? "line-clamp-4" : ""
                            }`}
                        >
                          “{t.content}”
                        </motion.p>
                        {isMobile && (
                          <button
                            onClick={toggleExpand}
                            className="mt-3 flex items-center gap-1 text-yellow-600 font-bold text-sm hover:text-yellow-700 transition-colors"
                          >
                            {expanded ? (
                              <>
                                Show less <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Read full story <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 pt-3 sm:pt-4 flex justify-between items-center text-xs sm:text-sm text-gray-400">
                        <span>Yetosol Partner</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators + swipe hint */}
          <div className="flex flex-col items-center gap-2 mt-6 sm:mt-8">
            <div className="flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === selectedIndex
                    ? "bg-yellow-400 w-8 shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                    : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            {/* Swipe hint – only on mobile, fades out */}
            {isMobile && showSwipeHint && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"
              >
                <ChevronLeft className="h-3 w-3" />
                Swipe to explore
                <ChevronRight className="h-3 w-3" />
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}