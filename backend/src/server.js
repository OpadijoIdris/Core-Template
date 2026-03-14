import app from "./app.js";
import dotenv from "dotenv";
import connectMongoDB from "./config/mongo.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
    })
};

startServer();
