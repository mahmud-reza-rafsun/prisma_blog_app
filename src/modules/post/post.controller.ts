import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(400).json({
            error: "unAuthorized!!",
        })
    }
    try {
        console.log(req.user);
        const result = await postService.createPost(req.body, user?.id as string);
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            error: "Post creation failed",
            details: error,
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchStr = typeof search === "string" ? search : undefined
        const result = await postService.getAllPost({ search: searchStr })
        res.status(200).json({
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            error: "Retrive all post failed",
            details: error,
        })
    }
}


export const postController = {
    createPost,
    getAllPost
}