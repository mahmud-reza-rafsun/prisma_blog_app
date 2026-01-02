import express, { Application } from "express"
import { postRoute } from "./modules/post/post.route";

const app: Application = express();

app.use(express.json())


app.use('/posts', postRoute)


app.get('/', (req, res) => {
    res.send("Server is on");
});



export default app;