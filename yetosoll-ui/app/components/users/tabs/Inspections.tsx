import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProjectInspections, updateInspection } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Scan, Loader2, ClipboardCheck, Pencil, X, Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import SiteInspectionUploadModal from "../SiteInspectionUploadModal.js";
import Loader from "@/components/global/Loader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { SiteInspection } from "@/types";
import { getSocket } from "@/lib/socket";

const Inspections = ({ projectId }: { projectId: string }) => {
  const { data: session } = authClient.useSession();
  const canEdit = session?.user?.role === "admin" || session?.user?.role === "project_manager" || session?.user?.role === "supervisor";

  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState("");

  const { data: inspections, isLoading, refetch } = useQuery({
    queryKey: ["inspections", projectId],
    queryFn: () => getProjectInspections(projectId),
  });

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleUpdate = () => refetch();
    socket.on("inspection_added", handleUpdate);
    socket.on("inspection_updated", handleUpdate);

    return () => {
      socket.off("inspection_added", handleUpdate);
      socket.off("inspection_updated", handleUpdate);
    };
  }, [refetch]);

  const updateNotesMutation = useMutation({
    mutationFn: updateInspection,
    onSuccess: () => {
      toast.success("Notes saved");
      setEditingId(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const startEditing = (inspection: SiteInspection) => {
    setEditingId(inspection._id);
    setNotesContent(inspection.inspectorNotes || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNotesContent("");
  };

  const saveNotes = (id: string) => {
    updateNotesMutation.mutate({
      id,
      data: { inspectorNotes: notesContent, status: "inspected" },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2 text-sm text-black dark:text-white">
          <Scan className="h-4 w-4" /> Site Inspections
        </h3>
        <SiteInspectionUploadModal projectId={projectId} />
      </div>
      {isLoading ? (
        <Loader label="Loading inspections..." />
      ) : !inspections || inspections.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-10 border rounded-lg border-dashed">
          No inspections recorded for this project.
        </p>
      ) : (
        inspections.map((inspection) => (
          <Card key={inspection._id} className="overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
            <div className="relative h-48 bg-black w-full flex items-center justify-center">
              <img
                src={inspection.imageUrl}
                alt={inspection.location}
                className="h-full object-contain opacity-90"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {new Date(inspection.createdAt).toLocaleDateString()}
              </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex justify-between items-center text-black dark:text-white">
                {inspection.inspectionType} – {inspection.location}
                <Badge
                  variant="secondary"
                  className={
                    inspection.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : inspection.status === "inspected"
                        ? "bg-light-blue-100 text-light-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {inspection.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="p-3 bg-light-blue-50/50 dark:bg-light-blue-950/20 border border-light-blue-100 dark:border-light-blue-900/50 rounded-md relative group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-light-blue-600 dark:text-light-blue-400 font-bold text-[11px] uppercase tracking-wider">
                    <ClipboardCheck className="h-3.5 w-3.5" /> Inspector's Notes
                  </div>
                  {canEdit && editingId !== inspection._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-light-blue-600 hover:text-light-blue-800 opacity-0 group-hover:opacity-100"
                      onClick={() => startEditing(inspection)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                {editingId === inspection._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notesContent}
                      onChange={(e) => setNotesContent(e.target.value)}
                      placeholder="Add your inspection notes..."
                      className="min-h-20 text-xs bg-white dark:bg-zinc-800"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>
                        <X className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-yellow-500 text-black hover:bg-yellow-400"
                        onClick={() => saveNotes(inspection._id)}
                        disabled={updateNotesMutation.isPending}
                      >
                        {updateNotesMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5 mr-1" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {inspection.inspectorNotes || "No notes added yet."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Inspections;