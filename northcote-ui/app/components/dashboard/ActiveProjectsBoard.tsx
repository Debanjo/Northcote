import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects, getUsers } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Hammer,
  ClipboardCheck,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import useEmblaCarousel from "embla-carousel-react";

export default function ActiveProjectsBoard() {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const [searchTerm, setSearchTerm] = useState("");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery({
    queryKey: ["all-projects"],
    queryFn: getAllProjects,
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsError,
  } = useQuery({
    queryKey: ["clients-list"],
    queryFn: () => getUsers({ role: "client", limit: 100 }),
  });

  if (projectsLoading || clientsLoading) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-xl bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (projectsError || clientsError) {
    return <div className="text-red-500">Failed to load projects.</div>;
  }

  const clients = clientsData?.res || [];
  const allProjects = projects || [];

  const enrichedProjects = allProjects.map((proj: any) => {
    const client = clients.find((c: User) => c._id === proj.clientId);
    return {
      ...proj,
      clientName: client?.name || "Unknown Client",
      clientEmail: client?.email,
      clientImage: client?.image,
    };
  });

  const filteredProjects = enrichedProjects.filter(
    (p: any) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.assignedManagerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.assignedSupervisorName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-black">
            Active Projects & Assignments
          </h2>
          <p className="text-sm text-gray-500">Overview of all projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 w-56 bg-white border-gray-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 whitespace-nowrap">
            {filteredProjects.length} Projects
          </Badge>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl text-gray-500">
          <Activity className="h-10 w-10 mb-2 opacity-20" />
          <p>No projects match your search.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {filteredProjects.map((project: any) => {
                const isMyProjectAsManager =
                  currentUser?.role === "project_manager" &&
                  project.assignedManagerId === currentUser?.id;
                const isMyProjectAsSupervisor =
                  currentUser?.role === "supervisor" &&
                  project.assignedSupervisorId === currentUser?.id;
                const isHighlighted = isMyProjectAsManager || isMyProjectAsSupervisor;

                return (
                  <div
                    key={project._id}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] pl-4"
                  >
                    <Card
                      className={cn(
                        "h-full overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg hover:-translate-y-1",
                        isHighlighted
                          ? "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/10 bg-yellow-50/30"
                          : "bg-white"
                      )}
                    >
                      {isHighlighted && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
                      )}

                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                              <AvatarImage src={project.clientImage || ""} />
                              <AvatarFallback
                                className={isHighlighted ? "bg-yellow-100 text-yellow-800" : ""}
                              >
                                {project.clientName?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-bold text-sm leading-tight text-black">
                                {project.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {project.clientName} • {project.clientEmail || ""}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              project.status === "active"
                                ? "bg-green-100 text-green-800"
                                : project.status === "on_hold"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className={cn(
                              "p-2 rounded-md border flex flex-col gap-1",
                              isMyProjectAsManager
                                ? "bg-yellow-100 border-yellow-200"
                                : "bg-gray-50"
                            )}
                          >
                            <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                              <Hammer size={10} /> Manager
                            </span>
                            <span
                              className={cn(
                                "text-xs font-semibold truncate",
                                isMyProjectAsManager && "text-yellow-800"
                              )}
                            >
                              {project.assignedManagerName || "Unassigned"}
                            </span>
                          </div>

                          <div
                            className={cn(
                              "p-2 rounded-md border flex flex-col gap-1",
                              isMyProjectAsSupervisor
                                ? "bg-light-blue-100 border-light-blue-200"
                                : "bg-gray-50"
                            )}
                          >
                            <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                              <ClipboardCheck size={10} /> Supervisor
                            </span>
                            <span
                              className={cn(
                                "text-xs font-semibold truncate",
                                isMyProjectAsSupervisor && "text-light-blue-800"
                              )}
                            >
                              {project.assignedSupervisorName || "Unassigned"}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs">
                          <span className="text-gray-500 block mb-0.5 font-medium">
                            Requirements:
                          </span>
                          <p className="text-gray-700 line-clamp-2">
                            {project.requirements?.length
                              ? project.requirements.join(", ")
                              : "None specified"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Progress:</span>
                          <span className="font-medium text-black">
                            {project.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredProjects.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 hover:bg-yellow-50 disabled:opacity-30 z-10"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 hover:bg-yellow-50 disabled:opacity-30 z-10"
                onClick={scrollNext}
                disabled={!canScrollNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {filteredProjects.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {filteredProjects.map((_: any, index: number) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    emblaApi?.selectedScrollSnap() === index
                      ? "bg-yellow-500 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}