import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, getAllProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectDetailsSheet from "@/components/projects/ProjectDetailsSheet";
import Loader from "@/components/global/Loader";
import { getSocket } from "@/lib/socket";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["all-projects"],
    queryFn: getAllProjects,
  });

  const { data: clients } = useQuery({
    queryKey: ["clients-list"],
    queryFn: () => getUsers({ role: "client", limit: 100 }),
  });

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleProjectCreated = () => {
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    };
    const handleProjectUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    };

    socket.on("project_created", handleProjectCreated);
    socket.on("project_updated", handleProjectUpdated);

    return () => {
      socket.off("project_created", handleProjectCreated);
      socket.off("project_updated", handleProjectUpdated);
    };
  }, [queryClient]);

  const projects = (projectsData || []).map((p: any) => {
    const client = (clients?.res || []).find((c: any) => c._id === p.clientId);
    return {
      _id: p._id,
      name: p.name,
      clientName: client?.name || "Unknown Client",
      clientId: p.clientId,
      status: p.status,
      progress: p.progress || 0,
      startDate: p.startDate,
      estimatedCompletion: p.estimatedCompletion,
    };
  });

  if (isLoading) return <Loader label="Loading projects..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-black">Projects</h1>
        <CreateProjectModal />
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p: any) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.clientName}</TableCell>
                    <TableCell>
                      <Badge className={p.status === "active" ? "bg-green-100 text-green-800" : ""}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.progress}%</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(p);
                          setSheetOpen(true);
                        }}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProjectDetailsSheet
        project={selectedProject}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}