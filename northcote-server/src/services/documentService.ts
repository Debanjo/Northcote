import Document, { type IDocument } from "../models/Document.js";
import { AppError } from "../utils/AppError.js";

export const documentService = {
    getByProject(projectId: string) {
        return Document.find({ projectId }).sort({ createdAt: -1 }).lean();
    },

    async create(
        projectId: string,
        data: {
            name: string;
            type: IDocument["type"];              
            fileUrl?: string;
            status?: IDocument["status"];          
        }
    ) {
        return Document.create({ ...data, projectId });
    },

    async delete(id: string) {
        const doc = await Document.findById(id);
        if (!doc) throw new AppError("Document not found", 404);
        await Document.findByIdAndDelete(id);
        return doc;
    },
};