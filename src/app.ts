import express, { Application } from "express"
import { postRoute } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'
import { commentRoute } from "./modules/comment/comment.route";
import errorHandler from "./middleware/globalErrorHandler";

const app: Application = express();
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json())

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))


app.use('/posts', postRoute);
app.use('/comments', commentRoute);
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send("Server is on");
});



export default app;