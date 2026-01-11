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

    res.status(statusCode);
    res.json({
        messsage: errorMessage,
        error: errorDetails
    })
};

export default errorHandler;