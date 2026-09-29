// northcote-server/src/inngest/functions.ts
import mongoose from "mongoose";
import { inngest } from "./client.js";
import { NonRetriableError } from "inngest";
import { notifyUsers } from "./notifyUsers.js";
import { invoiceService } from "../services/invoiceService.js";

// ---- assignProjectTeam ----

export const assignProjectTeam = inngest.createFunction(
  { id: "assign-project-team" },
  { event: "project/created" },
  async ({ event, step }: { event: any; step: any }) => {
    const { projectId, requirements } = event.data;

    const collection = mongoose.connection.collection("user");

    const data = await step.run("fetch-project-data", async () => {
      const project = await collection.findOne({
        _id: new mongoose.Types.ObjectId(projectId),
      });
      const managers = await collection
        .find({ role: "project_manager", status: "active", availability: true })
        .toArray();
      const supervisors = await collection
        .find({ role: "supervisor", status: "active", availability: true })
        .toArray();
      return { project, managers, supervisors };
    });

    if (!data.project || data.managers.length === 0 || data.supervisors.length === 0) {
      throw new NonRetriableError("Missing project or available staff.");
    }

    const assignment = (await step.run("deterministic-assignment", () => {
      const requirementsArray = Array.isArray(requirements) ? requirements : requirements ? [requirements] : [];

      const scoredManagers = data.managers.map((m: any) => ({
        _id: m._id,
        name: m.name,
        score: (m.skills || []).filter((s: string) => requirementsArray.includes(s)).length,
      }));
      scoredManagers.sort((a: any, b: any) => b.score - a.score);
      const bestManager = scoredManagers[0];
      if (!bestManager) {
        throw new NonRetriableError("No manager could be selected.");
      }

      const scoredSupervisors = data.supervisors.map((s: any) => ({
        _id: s._id,
        name: s.name,
        score: (s.skills || []).filter((skill: string) => requirementsArray.includes(skill)).length,
      }));
      scoredSupervisors.sort((a: any, b: any) => b.score - a.score);
      const bestSupervisor = scoredSupervisors[0];
      if (!bestSupervisor) {
        throw new NonRetriableError("No supervisor could be selected.");
      }

      return {
        managerId: bestManager._id.toString(),
        managerName: bestManager.name,
        supervisorId: bestSupervisor._id.toString(),
        supervisorName: bestSupervisor.name,
        reasoning: `Assigned based on skill match and availability.`,
      };
    })) as {
      managerId: string;
      managerName: string;
      supervisorId: string;
      supervisorName: string;
      reasoning: string;
    };

    const updatedProject = await step.run("update-database", async () => {
      const updatePayload = {
        status: "active",
        requirements,
        assignedManagerId: assignment.managerId,
        assignedManagerName: assignment.managerName,
        assignedSupervisorId: assignment.supervisorId,
        assignedSupervisorName: assignment.supervisorName,
        assignmentReasoning: assignment.reasoning,
      };
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(projectId) },
        { $set: updatePayload }
      );
      return await collection.findOne({ _id: new mongoose.Types.ObjectId(projectId) });
    });

    await step.run("send-notification", async () => {
      await notifyUsers(
        assignment.managerId,
        assignment.supervisorId,
        "New Project Assigned",
        `You have been assigned to project: ${updatedProject?.name}`,
        `/projects/${projectId}`,
        "assignment"
      );
    });

    return { success: true, assignment, updatedProject };
  }
);

// ---- addChargeToInvoice ----

export const addChargeToInvoice = inngest.createFunction(
  { id: "add-project-charge" },
  { event: "billing/charge.added" },
  async ({ event, step }: { event: any; step: any }) => {
    const { clientId, description, priceInCents } = event.data;
    if (!clientId || !priceInCents) {
      throw new NonRetriableError("Missing required charge information.");
    }

    // Delegate to the single atomic implementation shared with POST /invoice/charge
    // instead of re-implementing the read-modify-write here (the two had already
    // drifted and could double-count concurrent charges). No real user initiated
    // this — pass no actor id rather than a placeholder string (ActivityLog.user
    // is a real ObjectId ref; a non-ObjectId placeholder would throw a CastError).
    const invoice = await step.run("add-charge", () =>
      invoiceService.addCharge(clientId, description, priceInCents, undefined)
    );

    return { success: true, invoiceId: invoice._id.toString() };
  }
);