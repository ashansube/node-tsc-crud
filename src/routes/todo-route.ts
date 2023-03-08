import { Router, Request, Response, NextFunction } from "express";
import Todo, { ToDoModel } from "../models/todo-model";
import { Schemas, validateTodo } from "../middlewares/todo-validate";
import { TokenValidation } from '../middlewares/verify-token';

const router = Router();

router.post(
  "/", [TokenValidation,
  validateTodo(Schemas.create)],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: ToDoModel = req.body;
      console.log("Data", data);
      var todos = await Todo.create(data);
      return res
        .status(200)
        .json({ message: "ToDo created successfully", data: todos });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.get("/", TokenValidation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    var todos = await Todo.find({});
    return res.status(200).json({ message: "All ToDos!", data: todos });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch(
  "/:id",
  [TokenValidation, validateTodo(Schemas.update)],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      var todos = await Todo.findByIdAndUpdate(id, req.body, { new: true });
      return res
        .status(200)
        .json({ message: "ToDo updated successfully!", data: todos });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/:id", TokenValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      var isDeleted = await Todo.findByIdAndDelete(id);
      if (!isDeleted) throw new Error("Failed to delete ToDo");
      return res.status(200).json({ message: "ToDo deleted successfully!" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
