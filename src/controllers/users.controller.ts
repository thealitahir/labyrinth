import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto, UserLoginDto } from '../dto/user.request.dto';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import User from '../models/user.model'
dotenv.config();

// make a controller for create a user
const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = plainToClass(UserDto, req.body); 
    const errors = await validate(newUser);

    if (errors.length > 0) {
      return res.status(422).json({ status: false, error: errors });
    }

    const savedUser = await User.findOne({ email: req.body.email });
    if(savedUser) {
      return res.status(422).json({ status: false, error: "User with this email already exists" });
    }

    const user = new User({
      ...newUser
    });
    // Save the new User instance to the database
    await user.save();
    delete user.password
    return res.status(200).json({
      status: true,
      message: "Create a new user successfully.",
      data: user
    });
  } catch (error: any) {
    res.status(422).json({ status: false, error: error.message });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = plainToClass(UserLoginDto, req.body); 
    const errors = await validate(user);

    if (errors.length > 0) {
      return res.status(422).json({ status: false, error: errors });
    }

    const { email, password } = user;

    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      return res.status(401).json({ status: false, error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, savedUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ status: false, error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET, {
      expiresIn: "20h",
    });

    return res.status(200).json({
      status: true,
      message: "Create a new user successfully.",
      data: savedUser,
      token
    });
  } catch (error: any) {
    res.status(422).json({ status: false, error: error.message });
  }
};

export { createUser, loginUser }
