import mongoose from "mongoose";

const getUsersCollection = () => mongoose.connection.collection("user");

export const userService = {
    findById(id: string) {
        const queryId = mongoose.Types.ObjectId.isValid(id)
            ? new mongoose.Types.ObjectId(id)
            : id;
        return getUsersCollection().findOne({ _id: queryId } as any);
    },

    findByIdWithoutPassword(id: string) {
        return getUsersCollection().findOne(
            { _id: new mongoose.Types.ObjectId(id) } as any,
            { projection: { password: 0 } }
        );
    },

    updateById(id: string, update: any) {
        return getUsersCollection().updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: update }
        );
    },

    countDocuments(filter: any = {}) {
        return getUsersCollection().countDocuments(filter);
    },

    findMany(filter: any = {}, options: { projection?: any; sort?: any; skip?: number; limit?: number } = {}) {
        const { projection, sort, skip, limit } = options;
        let cursor = getUsersCollection().find(filter, { projection });
        if (sort) cursor = cursor.sort(sort);
        if (skip) cursor = cursor.skip(skip);
        if (limit) cursor = cursor.limit(limit);
        return cursor.toArray();
    },
};