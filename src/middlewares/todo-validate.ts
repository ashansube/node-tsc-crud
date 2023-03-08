import Joi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import { ToDoModel } from "../models/todo-model";

export const validateTodo = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            console.log(error);
            return res.status(422).json({ error });
        }
    }
}

export const Schemas = {
    create: Joi.object<ToDoModel>({
        title: Joi.string().required(),
        description: Joi.string().required()
    }),
    update: Joi.object<ToDoModel>({
        title: Joi.string().required(),
        description: Joi.string().required()
    })
}
