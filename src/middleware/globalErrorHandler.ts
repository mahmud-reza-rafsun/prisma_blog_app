import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

const errorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let errorMessage = "Internal Server error";
    let errorDetails = error;

    if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provide incorrect fields type or missing fileds!"
    }

    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            statusCode = 400;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found."
        }
        else if (error.code === "P2002") {
            statusCode = 400;
            errorMessage = "Unique constraint failed on the constraint";
        }
        else if (error.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed on the field"
        }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 400;
        errorMessage = "Response from the Engine was empty";
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        if (error.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Authentiction failed, please check your creditials!"
        }
        else if (error.errorCode === "P1001") {
            statusCode = 400;
            errorMessage = "Can't reach database server"
        }
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 400;
        errorMessage = "Error opening a TLS connection"
    }

    res.status(statusCode);
    res.json({
        messsage: errorMessage,
        error: errorDetails
    })
};

export default errorHandler;