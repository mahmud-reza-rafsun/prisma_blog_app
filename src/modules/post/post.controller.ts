import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";
import { UserRole } from "../../lib/role";

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

const getMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        const result = await postService.getMyPost(user?.id as string);
        res.status(200).json({ data: result })
    } catch (error: any) {
        res.status(400).json({
            error: "Retrive my post faileld!!!",
            details: error,
        })
    }
}

const updateMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are not unAuthorized");
        }
        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN;
        console.log(user);
        const result = await postService.updateMyPost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json({ data: result })
    } catch (error: any) {
        res.status(400).json({
            error: "update post faield!!!",
            details: error,
        })
    }
}

const deleteMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are not unAuthorized");
        }
        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN;
        console.log(user);
        const result = await postService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json({ data: result })
    } catch (error: any) {
        const errorMessage = (error instanceof Error) ? error.message : "delete post faield!!"
        res.status(400).json({
            error: errorMessage,
            details: error,
        })
    }
}

const getStats = async (req: Request, res: Response) => {
    try {
        const result = await postService.getStats();
        res.status(200).json({ data: result })
    } catch (error: any) {
        const errorMessage = (error instanceof Error) ? error.message : "delete post faield!!"
        res.status(400).json({
            error: errorMessage,
            details: error,
        })
    }
}


export const postController = {
    createPost,
    getAllPost,
    getAllPostById,
    getMyPost,
    updateMyPost,
    deleteMyPost,
    getStats
}