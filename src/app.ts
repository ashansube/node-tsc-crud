import express, { Application } from "express";
import db from "mongoose";
import todoRoutes from "./routes/todo-route";
import AuthController from "./routes/user-route";
import { json, urlencoded } from "body-parser";

const app: Application = express();

app.use(json());

app.use(urlencoded({extended:true}));

app.use("/todos", todoRoutes);
app.use("/api/auth", AuthController);

app.use((err:Error, req:express.Request, res:express.Response, next:express.NextFunction) => {
    res.status(500).json({message:err.message});
})

db.set("strictQuery", false);
db.connect("mongodb://localhost:27017/todos", () => {
    console.log("MongoDB Connected");
})

app.listen(3000);
