import * as mongoose from "mongoose";
import { Model } from "mongoose";

type ToDoType = ToDoModel & mongoose.Document

export interface ToDoModel {
    title: {
        type: String,
        required: true
    };

    description: {
        type: String,
        required: true
    }
}

const TodosSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Todo: Model<ToDoType> = mongoose.model<ToDoType>('Todo', TodosSchema);

export default Todo;