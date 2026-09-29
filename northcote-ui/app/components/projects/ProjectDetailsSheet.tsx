import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectMilestones,
  getProjectDocuments,
  updateProjectProgress,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  createDocument,
  deleteDocument,
} from "@/lib/api";
import { UploadDropzone, type UploadResponse } from "@/lib/uploadthing";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  X,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface Milestone {
  _id: string;
  name: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  order: number;
  evidenceUrls?: string[];
}

interface Document {
  _id: string;
  name: string;
  type: "contract" | "change_order" | "drawing" | "permit" | "other";
  fileUrl?: string;
  status: "draft" | "pending" | "approved" | "signed";
}

export default function ProjectDetailsSheet({ project, open, onClose }: any) {
  const [activeTab, setActiveTab] = useState("overview");
  const [manualProgressOpen, setManualProgressOpen] = useState(false);
  const queryClient = useQueryClient();

  const progressMutation = useMutation({
    mutationFn: (newProgress: number) => updateProjectProgress(project._id, newProgress),
    onSuccess: () => {
      toast.success("Progress updated");
      queryClient.invalidateQueries({ queryKey: ["client-project"] });
      queryClient.invalidateQueries({ queryKey: ["clients-with-projects"] });
    },
  });

  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl w-full bg-white p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-2 border-b">
          <SheetTitle className="text-2xl font-black text-black">{project.name}</SheetTitle>
          <SheetDescription className="text-gray-500">
            Manage project details, milestones, and documents.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none py-3"
            >
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none py-3"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="font-medium text-black">{project.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
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
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium text-black">
                    {project.startDate ? format(new Date(project.startDate), "MMM dd, yyyy") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Completion</p>
                  <p className="font-medium text-black">
                    {project.estimatedCompletion
                      ? format(new Date(project.estimatedCompletion), "MMM dd, yyyy")
                      : "TBD"}
                  </p>
                </div>
              </div>

              {/* Progress Section (Read-only with override) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-black">Project Progress ({project.progress || 0}%)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setManualProgressOpen(true)}
                    className="h-8 text-light-blue-600"
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Override
                  </Button>
                </div>
                <Progress value={project.progress || 0} className="h-2 bg-gray-100" />
                <p className="text-xs text-gray-500">
                  Progress is calculated automatically from completed milestones.
                </p>
              </div>

              {project.requirements?.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-2">Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {project.requirements.map((req: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-gray-50">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="mt-0 space-y-4">
              <MilestoneManager projectId={project._id} />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0 space-y-4">
              <DocumentManager projectId={project._id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>

      {/* Manual Progress Override Dialog */}
      <ManualProgressDialog
        open={manualProgressOpen}
        onOpenChange={setManualProgressOpen}
        currentProgress={project.progress || 0}
        onSave={(newProgress) => {
          progressMutation.mutate(newProgress, {
            onSuccess: () => {
              setManualProgressOpen(false);
              queryClient.invalidateQueries({ queryKey: ["client-project"] });
              queryClient.invalidateQueries({ queryKey: ["clients-with-projects"] });
            },
          });
        }}
        isPending={progressMutation.isPending}
      />
    </Sheet>
  );
}

// --- Manual Progress Dialog Component ---
function ManualProgressDialog({
  open,
  onOpenChange,
  currentProgress,
  onSave,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProgress: number;
  onSave: (progress: number) => void;
  isPending: boolean;
}) {
  const [value, setValue] = useState(currentProgress);

  useEffect(() => {
    setValue(currentProgress);
  }, [currentProgress, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle>Manual Progress Override</DialogTitle>
          <DialogDescription>
            Set a custom progress percentage. This will override the automatic milestone calculation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Progress (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(value)}
            disabled={isPending}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Milestone Manager Component ---
function MilestoneManager({ projectId }: { projectId: string }) {
  const { data: milestones, isLoading } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getProjectMilestones(projectId),
    enabled: !!projectId,
  });

  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const createMutation = useMutation({
    // ✅ Exact required fields for creation
    mutationFn: (data: { name: string; dueDate: string; status?: string; evidenceUrls?: string[] }) =>
      createMilestone(projectId, data),
    onSuccess: () => {
      toast.success("Milestone added");
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      setIsAddOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Milestone> }) => updateMilestone(id, data),
    onSuccess: () => {
      toast.success("Milestone updated");
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      setEditingMilestone(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMilestone,
    onSuccess: () => {
      toast.success("Milestone deleted");
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-black">Project Milestones</h3>
        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="bg-yellow-500 text-black hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {!milestones?.length ? (
        <p className="text-gray-500 text-center py-6">No milestones yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {milestones.map((m: Milestone) => (
              <TableRow key={m._id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{format(new Date(m.dueDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(m.status)}
                    <span className="text-xs capitalize">{m.status.replace("_", " ")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingMilestone(m)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => deleteMutation.mutate(m._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Milestone Dialog */}
      <MilestoneDialog
        open={isAddOpen || !!editingMilestone}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingMilestone(null);
          }
        }}
        milestone={editingMilestone}
        onSave={(data) => {
          if (editingMilestone) {
            updateMutation.mutate({ id: editingMilestone._id, data });
          } else {
            // ✅ Safe assertion: form validation guarantees name & dueDate exist in create mode
            createMutation.mutate(data as { name: string; dueDate: string; status?: string; evidenceUrls?: string[] });
          }
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}

// --- Document Manager Component ---
function DocumentManager({ projectId }: { projectId: string }) {
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => getProjectDocuments(projectId),
    enabled: !!projectId,
  });

  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<Document["type"]>("other");

  const createMutation = useMutation({
    mutationFn: (data: { name: string; type: string; fileUrl?: string; status?: string }) =>
      createDocument(projectId, data),
    onSuccess: () => {
      toast.success("Document added");
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
      setIsUploadOpen(false);
      setUploadedUrl("");
      setDocName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });

  const handleUploadComplete = (res: UploadResponse[]) => {
    setUploadedUrl(res[0].url);
    toast.success("File uploaded");
  };

  const handleSaveDocument = () => {
    if (!docName.trim()) {
      toast.error("Document name is required");
      return;
    }
    createMutation.mutate({
      name: docName,
      type: docType,
      fileUrl: uploadedUrl || undefined,
      status: "draft",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-black">Project Documents</h3>
        <Button
          size="sm"
          onClick={() => setIsUploadOpen(true)}
          className="bg-yellow-500 text-black hover:bg-yellow-400"
        >
          <Upload className="h-4 w-4 mr-1" /> Upload
        </Button>
      </div>

      {!documents?.length ? (
        <p className="text-gray-500 text-center py-6">No documents yet.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc: Document) => (
            <div
              key={doc._id}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-light-blue-600" />
                <div>
                  <p className="font-medium text-black">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {doc.type.replace("_", " ")} • {doc.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {doc.fileUrl && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  onClick={() => deleteMutation.mutate(doc._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Add a new document to this project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Document Name</Label>
              <Input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Contract.pdf" />
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as Document["type"])}
                className="w-full border rounded-md p-2 text-sm"
              >
                <option value="contract">Contract</option>
                <option value="change_order">Change Order</option>
                <option value="drawing">Drawing</option>
                <option value="permit">Permit</option>
                <option value="other">Other</option>
              </select>
            </div>
            {!uploadedUrl ? (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                headers={async () => {
                  const session = await authClient.getSession();
                  return { Authorization: `Bearer ${session.data?.session.token}` };
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                className="border-dashed border-gray-300 ut-label:text-light-blue-600"
              />
            ) : (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm truncate">File uploaded</span>
                <Button variant="ghost" size="sm" onClick={() => setUploadedUrl("")}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveDocument}
              disabled={createMutation.isPending || !docName}
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Milestone Dialog Component with Evidence Upload ---
function MilestoneDialog({
  open,
  onOpenChange,
  milestone,
  onSave,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: Milestone | null;
  onSave: (data: Partial<Milestone> & { evidenceUrls?: string[] }) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(milestone?.name || "");
  const [dueDate, setDueDate] = useState(
    milestone?.dueDate ? new Date(milestone.dueDate).toISOString().split("T")[0] : ""
  );
  const [status, setStatus] = useState<Milestone["status"]>(milestone?.status || "pending");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(milestone?.evidenceUrls || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (milestone) {
      setName(milestone.name);
      setDueDate(new Date(milestone.dueDate).toISOString().split("T")[0]);
      setStatus(milestone.status);
      setEvidenceUrls(milestone.evidenceUrls || []);
    } else {
      setName("");
      setDueDate("");
      setStatus("pending");
      setEvidenceUrls([]);
    }
  }, [milestone, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, dueDate: new Date(dueDate).toISOString(), status, evidenceUrls });
  };

  const removeEvidence = (urlToRemove: string) => {
    setEvidenceUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{milestone ? "Edit Milestone" : "Add Milestone"}</DialogTitle>
          <DialogDescription>
            {milestone ? "Update the milestone details." : "Create a new project milestone."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Milestone["status"])}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Evidence Upload Section */}
          <div>
            <Label>Evidence (Photos/Videos) - Optional</Label>
            <p className="text-xs text-gray-500 mb-2">
              Upload images or videos documenting milestone completion.
            </p>

            {evidenceUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {evidenceUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                    <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeEvidence(url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <UploadDropzone
              endpoint="imageUploader"
              onUploadBegin={() => setUploading(true)}
              onClientUploadComplete={(res: UploadResponse[]) => {
                setUploading(false);
                const newUrls = res.map((r) => r.url);
                setEvidenceUrls((prev) => [...prev, ...newUrls]);
                toast.success("Evidence uploaded");
              }}
              onUploadError={(error) => {
                setUploading(false);
                void toast.error(error.message);
              }}
              headers={async () => {
                const session = await authClient.getSession();
                return { Authorization: `Bearer ${session.data?.session.token}` };
              }}
              className="border-dashed border-gray-300 ut-label:text-light-blue-600"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || uploading}
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {(isPending || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {milestone ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}