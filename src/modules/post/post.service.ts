import { string } from "better-auth/*";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result
}

const getAllPost = async ({ search, tags, isFeatured, status, authorId }:
    {
        search: string | undefined, tags: string[] | [],
        isFeatured: boolean | undefined, status: PostStatus | undefined, authorId: string | undefined
    }) => {
    const andCondition: PostWhereInput[] = []
    if (search) {
        andCondition.push({
            OR: [

                {
                    title: {
                        contains: search as string,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: search as string,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: search as string
                    }
                }
            ]
        })
    }
    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andCondition.push({
            isFeatured
        })
    }

    if (status) {
        andCondition.push({
            status
        })
    }

    if (authorId) {
        andCondition.push({
            authorId
        })
    }

    const allPost = await prisma.post.findMany({
        where: {
            AND: andCondition
        }
    });
    return allPost;
}

export const postService = {
    createPost,
    getAllPost
}