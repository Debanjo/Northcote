import mongoose from "mongoose";
import ActivityLog from "../models/activityLog.js";

export const activityService = {
    log(userId: string | undefined, action: string, details?: string) {
        // user is optional on the schema — omit it entirely for system-initiated
        // entries rather than casting a placeholder string to ObjectId (throws).
        return ActivityLog.create({ user: userId || undefined, action, details });
    },
    async getLogs(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            ActivityLog.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ActivityLog.countDocuments(),
        ]);

        // better-auth owns the "user" collection directly (no Mongoose model
        // backs it), so .populate("user") can never resolve here — batch-fetch
        // the referenced users in one query instead.
        const userIds = [...new Set(logs.map((l) => l.user?.toString()).filter(Boolean))].map(
            (id) => new mongoose.Types.ObjectId(id)
        );
        const users = userIds.length
            ? await mongoose.connection
                .collection("user")
                .find({ _id: { $in: userIds } }, { projection: { name: 1, email: 1, image: 1, role: 1 } })
                .toArray()
            : [];
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));

        const res = logs.map((l) => ({ ...l, user: userMap.get(l.user?.toString()) || null }));

        return {
            res,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalData: total,
                limit,
            },
        };
    },
};