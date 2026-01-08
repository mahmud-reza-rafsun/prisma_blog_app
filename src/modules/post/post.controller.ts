import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";

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
        const searchStr = typeof search === "string" ? search : undefined;

        const tags = req.query.tags ? (req.query.tags as string).split(",") : []

        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined

        const status = req.query.status as PostStatus | undefined;

        const authorId = req.query.authorId as string | undefined;

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);


        const result = await postService.getAllPost({ search: searchStr, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder })
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

const getAllPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post id is required")
        }
        const result = await postService.getPostById(postId);
        res.status(200).json({ data: result })
    } catch (error: any) {
        res.status(400).json({
            error: "Retrive specific post by id",
            details: error,
        })
    }
}


export const postController = {
    createPost,
    getAllPost,
    getAllPostById
}