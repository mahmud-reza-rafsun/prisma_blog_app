import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    authorId: string,
    postId: string,
    parentId: string;

}) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    });
    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }
    return prisma.comment.create({
        data: payload
    })
}

const getCommentById = async (commentId: string) => {
    return await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
}

const getCommentByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

const deleteComment = async (commentId: string, authorId: string) => {
    const commentResult = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })
    console.log(commentResult);
    if (!commentResult) {
        throw new Error("Your provided input in invaild!");
    }
    return await prisma.comment.delete({
        where: {
            id: commentResult.id
        }
    });
}


export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment
}