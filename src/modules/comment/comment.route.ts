import expres from "express"
import { commentController } from "./comment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../lib/role";

const router = expres.Router();

router.get("/author/:authorId", commentController.getCommentByAuthor)

router.get("/:commentId", commentController.getCommentById)

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)

router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment)

export const commentRoute = router;