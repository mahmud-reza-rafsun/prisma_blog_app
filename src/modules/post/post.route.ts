import expres from "express"
import { postController } from "./post.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../lib/role";

const router = expres.Router();

router.post("/", auth(UserRole.USER), postController.createPost);

export const postRoute = router;