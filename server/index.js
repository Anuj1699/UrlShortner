import express from "express";
import urlRoute from "./routes/urlRoutes.js";
import userRoute from "./routes/userRoutes.js";
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import { mongoose } from 'mongoose';
import path from "path";

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO)
    .then(() => console.log("Connected"))
    .catch((error) => console.log(error));

const __dirname = path.resolve();    

app.use('/api/user', userRoute)
app.use('/api/url', urlRoute);

app.use(express.static(path.resolve(__dirname, 'client', 'dist')))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statuscode = err.statuscode || 500;
    const message = err.message || 'Internal Error'
    return res.status(statuscode).json({ message });
});

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
    console.log(`Port Started at ${Port}`);
})