// yetosoll-server/src/services/projectService.ts
import mongoose from "mongoose";
import Project from "../models/Project.js";
import Milestone from "../models/Milestone.js";
import { userService } from "./userService.js";
import { AppError } from "../utils/AppError.js";
import { inngest } from "../inngest/client.js";
import { logActivity } from "../lib/activity.js";

export const projectService = {
    /**
     * Creates a project for a client (used by admin/superadmin/project_manager)
     */
    async createProjectForClient(data: {
        clientId: string;
        name: string;
        requirements?: string[];
        location?: string;
        category?: string;
        year?: string;
        description?: string;
        image?: string;
        estimatedCompletion?: string;
        creatorId: string;
    }) {
        const { clientId, name, requirements, location, category, year, description, image, estimatedCompletion, creatorId } = data;

        // Update client status and store project info
        await userService.updateById(clientId, {
            status: "active",
            currentProject: name,
            requirements: requirements || [],
            estimatedCompletion,
        });

        // Trigger Inngest assignment
        await inngest.send({
            name: "project/created",
            data: { projectId: clientId, requirements: requirements || [] },
        });

        const client = await userService.findById(clientId);
        if (client) {
            await logActivity(
                creatorId,
                "Created Project",
                `Created project "${name}" for client: ${client.name} (${client.email})`
            );
        }

        return { message: "Project created and team assignment triggered" };
    },

    /**
     * Generic project creation into the Project collection
     */
    async createProject(data: {
        name: string;
        location: string;
        category: string;
        year: string;
        description: string;
        image: string;
        requirements?: string[];
        clientId?: string;
    }) {
        const project = await Project.create(data);
        // Emit socket event
        // (socket emission handled in controller)
        return project;
    },

    /**
     * Recalculate project progress based on milestones
     */
    async recalculateProgress(projectId: string): Promise<number> {
        const milestones = await Milestone.find({ projectId });
        const total = milestones.length;
        const completed = milestones.filter(m => m.status === "completed").length;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
        await Project.findByIdAndUpdate(projectId, { progress });
        return progress;
    },
};