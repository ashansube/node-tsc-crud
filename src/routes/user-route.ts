import { Router } from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user-model';
import * as dotenv from 'dotenv';
import { signupValidation, signinValidation } from '../middlewares/user-validate';
import { TokenValidation } from '../middlewares/verify-token';

const router = Router();
dotenv.config();

router.post('/signup', async (req: Request, res: Response) => {

    const { error } = signupValidation(req.body);
    if (error) return res.status(400).json(error.message);

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json('Email already exists');

    try {
        const newUser: IUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        newUser.password = await newUser.encrypPassword(newUser.password);
        const savedUser = await newUser.save();

        const token: string = jwt.sign({ _id: savedUser._id }, process.env['JWT_SECRET'] || '', {
            expiresIn: 60 * 60 * 24
        });
        res.header('auth-token', token).json(savedUser);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.post('/signin', async (req: Request, res: Response) => {
    const { error } = signinValidation(req.body);
    if (error) return res.status(400).json(error.message);
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json('Email or Password is wrong');
    const correctPassword = await user.validatePassword(req.body.password);
    if (!correctPassword) return res.status(400).json('Invalid Password');

    const token: string = jwt.sign({ _id: user._id }, process.env['JWT_SECRET'] || '');
    res.header('auth-token', token).json(token);
});

router.get('/profile', TokenValidation, async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
        return res.status(404).json('No User found');
    }
    res.json(user);
});

export default router;