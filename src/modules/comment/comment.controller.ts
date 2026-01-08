import { Request, Response } from "express"
import { commentService } from "./comment.service"

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id
        const result = await commentService.createComment(req.body);
        res.send(result)
    } catch (error: any) {
        res.status(400).json({
            error: "Comment creation failed",
            details: error,
        })
    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.getCommentById(commentId as string);
        res.send(result)
    } catch (error: any) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: error,
        })
    }
}

export const commentController = {
    createComment,
    getCommentById
}