// northcote-server/src/utils/AppError.ts
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // marks error as expected (not programming bug)
        Error.captureStackTrace(this, this.constructor);
    }
}