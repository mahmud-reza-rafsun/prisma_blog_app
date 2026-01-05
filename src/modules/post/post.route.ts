import expres from "express"
import { postController } from "./post.controller";
import auth from "../../middleware/auth.middleware";

const router = expres.Router()

router.post("/", auth(), postController.createPost);

export const postRoute = router;