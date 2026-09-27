import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  { src: "https://res.cloudinary.com/ami1jzfj/video/upload/v1784867447/Taj_bank_construction_grggkm.mp4", title: "Taj Bank Construction" },
  { src: "https://res.cloudinary.com/ami1jzfj/video/upload/v1784867454/work_in_progress_eoqk3k.mp4", title: "Work in Progress" },
];

interface SwipeableVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SwipeableVideoModal({ open, onOpenChange }: SwipeableVideoModalProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % videos.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrent((prev) => (prev - 1 + videos.length) % videos.length);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const dx = touchStartX.current - touchEndX.current;
    if (Math.abs(dx) > minSwipeDistance) {
      if (dx > 0) {
        goToNext(); // swiped left
      } else {
        goToPrevious(); // swiped right
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-black/90 border-none">
        <DialogTitle className="sr-only">Video Gallery</DialogTitle>

        <div
          className="relative w-full aspect-video overflow-hidden rounded-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <video
            key={current}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-contain"
            src={videos[current].src}
          />

          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition hidden sm:block"
            aria-label="Previous video"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition hidden sm:block"
            aria-label="Next video"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300",
                  i === current ? "bg-yellow-500 w-7" : "bg-white/60 hover:bg-white"
                )}
                aria-label={`Go to video ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white/70 text-xs bg-black/50 px-2 py-1 rounded-full sm:hidden">
            Swipe left or right
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <p className="text-white text-sm font-medium text-center">
            {videos[current].title}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}