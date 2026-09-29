import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

export async function executeApprovedAction(request: any) {
    const userCollection = mongoose.connection.collection("user");
    const projectCollection = mongoose.connection.collection("projects");

    switch (request.action) {
        case "delete_user":
            await userCollection.updateOne(
                { _id: new mongoose.Types.ObjectId(request.targetId) },
                { $set: { deleted: true } }
            );
            break;
        case "ban_user":
            await userCollection.updateOne(
                { _id: new mongoose.Types.ObjectId(request.targetId) },
                { $set: { banned: request.payload?.banned } }
            );
            break;
        case "delete_project":
            await projectCollection.updateOne(
                { _id: new mongoose.Types.ObjectId(request.targetId) },
                { $set: { deleted: true } }
            );
            break;
        case "change_role":
            await userCollection.updateOne(
                { _id: new mongoose.Types.ObjectId(request.targetId) },
                { $set: { role: request.payload?.role } }
            );
            break;
        default:
            throw new AppError(`Unknown action: ${request.action}`, 400);
    }
}