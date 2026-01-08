import expres from "express"
import { commentController } from "./comment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../lib/role";

const router = expres.Router();

router.get("/:commentId", commentController.getCommentById)

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)

export const commentRoute = router;