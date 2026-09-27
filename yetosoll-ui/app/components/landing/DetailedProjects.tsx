"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "building", label: "Building Construction" },
  { id: "civil", label: "Civil Works" },
  { id: "redevelopment", label: "Redevelopment & Retrofitting" },
  { id: "geotechnical", label: "Geotechnical" },
];

const projects = [
  {
    title: "Proposed Office Development for Everyday Kitchen Ltd",
    location: "Nike Art Gallery Road, Lekki",
    category: "building",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867447/kitchen1_kpkpwk.jpg",
    year: "2024",
    description: "A modern three-storey office complex with open floor plans and sustainable features.",
  },
  {
    title: "Proposed Office Development for Hasslan Properties",
    location: "42 Allen Avenue, Ikeja",
    category: "building",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/hasslan1_pm3dle.jpg",
    year: "2023",
    description: "Multi-tenant commercial building with high-speed elevators.",
  },
  {
    title: "Proposed Symphony Courts for Blackcountry Ltd",
    location: "Royal Garden Estate",
    category: "building",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/symphony1_rwv8bv.jpg",
    year: "2024",
    description: "Luxury residential development featuring 24 units.",
  },
  {
    title: "Installation of 216 piles at Plot J73",
    location: "Banana Island",
    category: "geotechnical",
    image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/banana1_nzzwx3.jpg",
    year: "2024",
    description: "Deep foundation work for a high-rise luxury apartment building.",
  },
];

export default function DetailedProjects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const catMatch = activeCategory === "all" || p.category === activeCategory;
      const searchMatch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  // Safe active project – only defined when filtered is not empty
  const activeProject = filtered.length > 0 ? filtered[currentIndex] || filtered[0] : null;

  // Reset currentIndex when filtered changes (e.g. category switch)
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentIndex(0);
    setSearchQuery("");
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 uppercase">Recent Projects</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                activeCategory === cat.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid – handle empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg font-bold">No projects found in this category.</p>
            <p className="text-sm mt-2">Please select another category or view all.</p>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, 6).map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={project.title}
                  className="group bg-white rounded-3xl border border-slate-200 p-2 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-lg mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3" /> {project.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View Full Portfolio button – only enabled if there are projects */}
        {filtered.length > 0 && (
          <div className="mt-20 text-center">
            <Button
              onClick={() => {
                setPortfolioOpen(true);
                setCurrentIndex(0);
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-xl transition-transform hover:scale-105"
            >
              View Full Portfolio <LayoutGrid className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Full Portfolio Modal – handle empty state gracefully */}
      <Dialog open={portfolioOpen} onOpenChange={setPortfolioOpen}>
        <DialogContent className="w-[95vw] h-[90vh] max-w-4xl p-0 overflow-hidden flex flex-col rounded-3xl border-none bg-white shadow-2xl">
          <div className="p-6 flex justify-between items-center bg-slate-900 text-white flex-shrink-0">
            <h2 className="text-sm font-bold tracking-widest uppercase">
              {filtered.length > 0
                ? `Project ${currentIndex + 1} of ${filtered.length}`
                : "No projects"}
            </h2>
            <Button variant="ghost" className="hover:bg-slate-800" onClick={() => setPortfolioOpen(false)}>
              <X />
            </Button>
          </div>

          <div className="p-6 bg-slate-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search projects by title..."
                className="h-14 pl-12 text-lg rounded-2xl border-0 shadow-sm"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentIndex(0);
                }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center text-slate-500">
                <p className="text-lg font-bold">No projects match your search.</p>
                <p className="text-sm mt-2">Try adjusting your search or select a different category.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-2xl"
                  >
                    <img
                      src={activeProject.image}
                      className="w-full aspect-video object-cover rounded-3xl shadow-lg mb-8"
                    />
                    <h3 className="text-3xl font-black mb-4">{activeProject.title}</h3>
                    <p className="text-slate-600 text-lg mb-8">{activeProject.description}</p>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                      <span className="bg-slate-100 px-4 py-2 rounded-full">{activeProject.location}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="p-6 border-t flex justify-between items-center bg-white">
            <Button
              variant="outline"
              disabled={currentIndex === 0 || filtered.length === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <div className="font-black text-slate-400">
              {filtered.length > 0 ? `${currentIndex + 1} / ${filtered.length}` : "0 / 0"}
            </div>
            <Button
              variant="outline"
              disabled={currentIndex === filtered.length - 1 || filtered.length === 0}
              onClick={() => setCurrentIndex((prev) => Math.min(filtered.length - 1, prev + 1))}
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}