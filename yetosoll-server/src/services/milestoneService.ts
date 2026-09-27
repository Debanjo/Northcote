import Milestone, { type IMilestone } from "../models/Milestone.js";
import { AppError } from "../utils/AppError.js";
import { projectService } from "./projectService.js";

export const milestoneService = {
    async getByProject(projectId: string) {
        return Milestone.find({ projectId }).sort({ order: 1, dueDate: 1 }).lean();
    },

    async create(
        projectId: string,
        data: {
            name: string;
            dueDate: string;
            status?: IMilestone["status"];
            evidenceUrls?: string[];
        }
    ) {
        const milestone = await Milestone.create({ ...data, projectId });
        await projectService.recalculateProgress(projectId);
        return milestone;
    },

    async update(id: string, updateData: Partial<IMilestone>, userId: string) {
        const old = await Milestone.findById(id);
        if (!old) throw new AppError("Milestone not found", 404);

        const milestone = await Milestone.findByIdAndUpdate(id, updateData, { new: true });
        if (!milestone) throw new AppError("Milestone not found", 404);

        if (updateData.status === "completed" && old.status !== "completed") {
            // optionally create site inspection from evidence
        }

        await projectService.recalculateProgress(milestone.projectId);
        return milestone;
    },

    async delete(id: string) {
        const milestone = await Milestone.findById(id);
        if (!milestone) throw new AppError("Milestone not found", 404);
        const projectId = milestone.projectId;
        await Milestone.findByIdAndDelete(id);
        await projectService.recalculateProgress(projectId);
        return milestone;
    },
};