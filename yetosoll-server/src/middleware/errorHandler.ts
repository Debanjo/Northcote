// yetosoll-server/src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate value entered";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val: any) => val.message)
            .join(", ");
    }

    // CastError (invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    if (process.env.NODE_ENV === "development") {
        res.status(statusCode).json({
            success: false,
            message,
            stack: err.stack,
            error: err,
        });
    } else {
        res.status(statusCode).json({
            success: false,
            message,
        });
    }
};