import expres from "express"
import { postController } from "./post.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../lib/role";

const router = expres.Router();

router.get("/", postController.getAllPost)

router.get("/my-post", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPost)

router.get("/:postId", postController.getAllPostById)

router.post("/", auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

router.patch("/:postId", auth(UserRole.USER, UserRole.ADMIN), postController.updateMyPost);

export const postRoute = router;