import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 3000

const main = async () => {
    try {
        await prisma.$connect();
        console.log("Connect to the Database succesfully");


        // listen
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        })
    } catch (error) {
        console.log("An error occurred: ", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();