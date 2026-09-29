import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  getAllProjects,
  getProjectInspections,
  getProjectMilestones,
  getProjectDocuments,
  getMyActiveInvoice,
  getBillingHistory,
  getUsers,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Building2,
  Calendar,
  Users,
  FileText,
  Receipt,
  Camera,
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ChatModal } from "@/components/chat/ChatModal";
import { getSocket } from "@/lib/socket";
import ContactPaymentModal from "@/components/payment/ContactPaymentModal";

interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  role?: string;
}

export default function ClientDashboard() {
  const [chatOpen, setChatOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const clientId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: allProjects, isLoading: projectLoading } = useQuery({
    queryKey: ["all-projects"],
    queryFn: getAllProjects,
    enabled: !!clientId,
  });

  const project = allProjects?.find((p: any) => p.clientId === clientId && p.status === "active");
  const projectId = project?._id;

  const { data: inspections, isLoading: inspectionsLoading } = useQuery({
    queryKey: ["inspections", projectId],
    queryFn: () => getProjectInspections(projectId!),
    enabled: !!projectId,
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getProjectMilestones(projectId!),
    enabled: !!projectId,
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => getProjectDocuments(projectId!),
    enabled: !!projectId,
  });

  const { data: activeInvoice } = useQuery({
    queryKey: ["active-invoice", clientId],
    queryFn: getMyActiveInvoice,
    enabled: !!clientId,
  });

  const { data: billingHistory } = useQuery({
    queryKey: ["billing-history", clientId],
    queryFn: () => getBillingHistory(clientId!),
    enabled: !!clientId,
  });

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["staff-users"],
    queryFn: () => getUsers({ role: "all", limit: 100 }),
    enabled: chatOpen,
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
    const handleInspectionUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["inspections", projectId] });
    };
    const handleMilestoneUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    };
    const handleDocumentUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    };

    socket.on("project_created", handleProjectCreated);
    socket.on("project_updated", handleProjectUpdated);
    socket.on("inspection_added", handleInspectionUpdate);
    socket.on("inspection_updated", handleInspectionUpdate);
    socket.on("milestone_created", handleMilestoneUpdate);
    socket.on("milestone_updated", handleMilestoneUpdate);
    socket.on("document_created", handleDocumentUpdate);
    socket.on("document_deleted", handleDocumentUpdate);

    return () => {
      socket.off("project_created", handleProjectCreated);
      socket.off("project_updated", handleProjectUpdated);
      socket.off("inspection_added", handleInspectionUpdate);
      socket.off("inspection_updated", handleInspectionUpdate);
      socket.off("milestone_created", handleMilestoneUpdate);
      socket.off("milestone_updated", handleMilestoneUpdate);
      socket.off("document_created", handleDocumentUpdate);
      socket.off("document_deleted", handleDocumentUpdate);
    };
  }, [queryClient, projectId]);

  const totalPaid = billingHistory?.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0) || 0;

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount / 100);

  const getDocumentIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-light-blue-600" />;
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "signed":
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const teamMembers: ChatUser[] = [
    project?.assignedManagerId && {
      _id: project.assignedManagerId,
      name: project.assignedManagerName || "Project Manager",
      role: "project_manager",
    },
    project?.assignedSupervisorId && {
      _id: project.assignedSupervisorId,
      name: project.assignedSupervisorName || "Supervisor",
      role: "supervisor",
    },
  ].filter(Boolean) as ChatUser[];

  const staffUsers = (staffData?.res || []).filter(
    (u: any) => u.role !== "client" && !u.banned
  ) as ChatUser[];

  const availableContacts = teamMembers.length > 0 ? teamMembers : staffUsers;

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Welcome back, {session?.user?.name}</h1>
          <p className="text-gray-500 flex items-center gap-2">
            {project?.name || "No active project"}{" "}
            {project?.status && (
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
            )}
          </p>
        </div>
        <Button
          className="bg-yellow-500 text-black hover:bg-yellow-400"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircle className="mr-2 h-4 w-4" /> Message Team
        </Button>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-black">
            <Building2 className="h-5 w-5 text-yellow-600" />
            Project Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {project?.progress || 0}% Complete
            </span>
            <span className="text-sm text-gray-500">
              Est. Completion: {project?.estimatedCompletion ? format(new Date(project.estimatedCompletion), "MMM yyyy") : "TBD"}
            </span>
          </div>
          <Progress value={project?.progress || 0} className="h-2 bg-gray-100" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-black">
                  <Camera className="h-5 w-5 text-light-blue-600" />
                  Recent Site Inspections
                </CardTitle>
                <CardDescription>Latest photos from your project</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-light-blue-600">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {inspectionsLoading ? (
                <Loader2 className="animate-spin h-6 w-6 text-gray-300 mx-auto" />
              ) : !inspections?.length ? (
                <p className="text-gray-500 text-center py-6">No inspections yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {inspections.slice(0, 3).map((insp: any) => (
                    <div key={insp._id} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={insp.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-white text-xs">{format(new Date(insp.createdAt), "MMM dd")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-black flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestonesLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-gray-300" />
                ) : !milestones?.length ? (
                  <p className="text-gray-500 text-center py-4">No milestones set.</p>
                ) : (
                  milestones.slice(0, 3).map((m: any) => (
                    <div key={m.id || m._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {m.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : m.status === "in_progress" ? (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium">{m.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(m.dueDate), "MMM dd")}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-black flex items-center gap-2">
                  <FileText className="h-4 w-4 text-light-blue-600" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {docsLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-gray-300" />
                ) : !documents?.length ? (
                  <p className="text-gray-500 text-center py-4">No documents yet.</p>
                ) : (
                  documents.slice(0, 3).map((doc: any) => (
                    <div key={doc.id || doc._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <p className="text-sm font-medium text-black">{doc.name}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {doc.type?.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatusBadge(doc.status)}
                        {doc.fileUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {documents?.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full text-light-blue-600">
                    View all documents <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-black flex items-center gap-2">
                <Users className="h-4 w-4 text-yellow-600" />
                Your Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-yellow-100 text-yellow-800">
                    {project?.assignedManagerName?.charAt(0) || "PM"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-black">{project?.assignedManagerName || "Not assigned"}</p>
                  <p className="text-xs text-gray-500">Project Manager</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Email coming soon")}>
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Phone coming soon")}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-light-blue-100 text-light-blue-800">
                    {project?.assignedSupervisorName?.charAt(0) || "SU"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-black">{project?.assignedSupervisorName || "Not assigned"}</p>
                  <p className="text-xs text-gray-500">Site Supervisor</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Email coming soon")}>
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Phone coming soon")}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-black flex items-center gap-2">
                <Receipt className="h-4 w-4 text-yellow-600" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-bold text-black">
                  {activeInvoice ? formatNaira(activeInvoice.totalAmount) : "₦0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-bold text-black">{formatNaira(totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Payment Due:</span>
                <span className="text-sm text-gray-700">Est. Jun 15, 2026</span>
              </div>
              <ContactPaymentModal />
            </CardContent>
          </Card>
        </div>
      </div>

      <ChatModal
        open={chatOpen}
        onOpenChange={setChatOpen}
        currentUser={{ id: clientId!, name: session?.user?.name!, image: session?.user?.image ?? undefined }}
        recipient={null}
        recipients={availableContacts}
      >
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {teamMembers.length > 0 ? "Select a team member to message" : "Select a staff member to message"}
          </p>
          {staffLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : availableContacts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">No contacts available.</p>
          ) : null}
        </div>
      </ChatModal>
    </div>
  );
}