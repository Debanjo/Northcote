import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Team"
                className="rounded-2xl h-64 object-cover w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Construction"
                className="rounded-2xl h-64 object-cover w-full mt-8"
              />
            </div>
            <div className="absolute -bottom-8 right-8 bg-yellow-500 p-6 rounded-2xl shadow-xl">
              <p className="text-4xl font-black text-black">20+</p>
              <p className="text-sm font-medium text-black">
                Years of Excellence
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <span className="text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-4xl font-black text-black dark:text-white">
              Quality Statement
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Our experts deliver innovative, efficient & value‑driven solutions
              for customers. Yetosol was incorporated in 2016 but has been
              operating since 2006, growing from a small crew to a professional
              consultancy firm.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Deliver projects of highest quality using latest technology.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Maintain a team of motivated professionals dedicated to
                  quality improvement.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Provide affordable and quality housing for all.
                </p>
              </div>
            </div>
            <Button variant="link" className="text-light-blue-600 p-0">
              Read more <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
          {[
            { value: "20+", label: "Years of Excellence" },
            { value: "150+", label: "Projects Delivered" },
            { value: "25+", label: "Expert Team Members" },
            { value: "200+", label: "Happy Clients" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-yellow-500">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
