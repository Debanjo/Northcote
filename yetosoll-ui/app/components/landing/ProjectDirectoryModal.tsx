import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
    { title: "Proposed Office Development for Everyday Kitchen Ltd", location: "Nike Art Gallery Road, Lekki", category: "building", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867447/kitchen1_kpkpwk.jpg" },
    { title: "Proposed Office Development for Hasslan Properties", location: "42 Allen Avenue, Ikeja", category: "building", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/hasslan1_pm3dle.jpg" },
    { title: "Proposed Symphony Courts for Blackcountry Ltd", location: "Royal Garden Estate", category: "building", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/symphony1_rwv8bv.jpg" },
    { title: "Proposed Country Home (Terrace Residence)", location: "Ilishan", category: "building", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/terrace2_d5hrow.jpg" },
    { title: "Noble House Development", location: "Banana Island, Lagos", category: "building", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867444/noble2_b918ed.jpg" },
    { title: "Installation of 216 piles at Plot J73", location: "Banana Island", category: "geotechnical", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867445/banana1_nzzwx3.jpg" },
    { title: "Reconnaissance Survey for Agbowa-Ode Remo Road", location: "Agbowa", category: "civil", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867450/group3_yf9vlg.jpg" },
    { title: "Design & Construction of Drainage Network", location: "Ajegunle Apapa", category: "civil", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867450/sand2_ppkfzm.jpg" },
    { title: "Soil Investigation at HLS Estate", location: "Ogudu GRA, Lagos", category: "geotechnical", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867449/symphony2_iaovsn.jpg" },
    { title: "Remodelling of Gas Stations for IBILE Oil", location: "Ikorodu & Amuwo Odofin", category: "redevelopment", image: "https://res.cloudinary.com/ami1jzfj/image/upload/v1784867442/construction_last_elzwa8.webp" },
];

const categories = [
    { id: "all", label: "All Projects" },
    { id: "building", label: "Building Construction" },
    { id: "civil", label: "Civil Works" },
    { id: "redevelopment", label: "Redevelopment" },
    { id: "geotechnical", label: "Geotechnical" },
];

const ITEMS_PER_PAGE = 8;

export function ProjectDirectoryModal({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
    const [search, setSearch] = useState("");
    const [activeCat, setActiveCat] = useState("all");
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        return projects.filter((p) => {
            const matchCat = activeCat === "all" || p.category === activeCat;
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [activeCat, search]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedData = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] lg:max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden bg-white shadow-2xl rounded-3xl border-0">

                {/* Unified Single Header Bar */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Project Repository</h2>
                        <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mt-1">Operational Dossier // Database</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-black" />
                    </button>
                </div>

                {/* Action Bar */}
                <div className="flex-shrink-0 px-8 py-4 flex flex-col md:flex-row gap-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-10 h-11 rounded-xl border-slate-200 focus:border-sky-500"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => { setActiveCat(c.id); setPage(0); }}
                                className={cn(
                                    "px-4 h-11 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all border",
                                    activeCat === c.id
                                        ? "bg-black text-white border-black"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                )}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Responsive Grid Content */}
                <div className="flex-grow overflow-y-auto p-8 bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeCat}-${page}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {paginatedData.map((project, idx) => (
                                <div key={idx} className="group border border-slate-100 rounded-2xl p-4 hover:shadow-2xl hover:border-sky-200 transition-all duration-300 flex flex-col">
                                    <div className="aspect-[4/3] bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h4 className="font-black text-black text-sm uppercase line-clamp-2 leading-tight flex-grow">{project.title}</h4>
                                    <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-slate-400 uppercase">
                                        <MapPin className="w-3 h-3 text-red-500" /> {project.location}
                                    </div>
                                    <Button className="w-full mt-4 bg-yellow-400 text-black hover:bg-yellow-500 font-black text-[10px] uppercase h-9 rounded-lg">
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Pagination */}
                <div className="flex-shrink-0 px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-white">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {page + 1} of {totalPages || 1}
                    </span>
                    <div className="flex gap-2">
                        <Button disabled={page === 0} onClick={() => setPage(page - 1)} variant="outline" className="rounded-xl px-4 border-slate-200">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} variant="outline" className="rounded-xl px-4 border-slate-200">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
