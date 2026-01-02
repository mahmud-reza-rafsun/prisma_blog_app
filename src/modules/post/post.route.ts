import expres from "express"
import { postController } from "./post.controller";

const router = expres.Router()

router.post("/", postController.createPost);

export const postRoute = router;