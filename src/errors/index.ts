import z from "zod"

export class AppError extends Error {
    constructor(
        message:string,
        public readonly statusCode: number,
        public readonly code:string
    ) {
        super(message)
        this.name="AppError"
    }
}

export class NotFoundError extends AppError {
    constructor (message:string){
        super(message,404,"NOT_FOUND");
        this.name="NotFoundError";
    }
}
export class BadRequestError extends AppError {
    constructor (message:string){
        super(message,400,"BAD_REQUEST");
        this.name="BadRequestError";
    }
}

export class InternalServerError extends AppError {
    constructor (message:string){
        super(message,500,"INTERNAL_SERVER_ERROR");
        this.name="InternalServerError";
    }
}

export class UnauthorizedError extends AppError {
    constructor (message:string){
        super(message,401,"UNAUTHORIZED");
        this.name="UnauthorizedError";
    }
}

export class ConflictError extends AppError {
    constructor (message:string){
        super(message,409,"CONFLICT");
        this.name="ConflictError";
    }
}

export const errorResponseSchema = z.object({
    message: z.string(),
    code: z.string(),
    statusCode: z.number()
})