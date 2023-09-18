import { RequestHandler } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import { hashData } from "../utils/dataHashing";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.session.userId)
      .select("+email")
      .exec();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

interface registerBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  PaymentInfo?: string;
  userPrefrences?: string;
}

export const registerUser: RequestHandler<
  unknown,
  unknown,
  registerBody,
  unknown
> = async (req, res, next) => {
  let { email, firstName, lastName, password } = req.body;
  try {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();

    if (!(firstName && email && password && lastName)) {
      res.status(500).json("Empty input field!");
      throw createHttpError(500, "Empty input fields!");
    }

    if (!/^[a-zA-Z]*$/.test(firstName && lastName)) {
      res.status(500).json("invalid name entered");
      throw createHttpError(500, "invalid name entered");
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.status(500).json("Invalid email entered");
      throw createHttpError(500, "invalid email entered");
    }
    if (password.length < 8) {
      res.status(500).json("passowrd is too short");
      throw createHttpError(500, "password is too short");
    }
    const existingEmail = await userModel.findOne({ email: email }).exec();

    if (existingEmail) {
      res.status(500).json("a user with email already existed, login instead");
      throw createHttpError(
        500,
        "a user with email already existed, login instead"
      );
    }

    const hashedPassword = await hashData(password);

    const user = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

interface loginBody {
  email: string;
  password: string;
}

export const loginUser: RequestHandler<
  unknown,
  unknown,
  loginBody,
  unknown
> = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      res.status(500).json("credential missing");
      createHttpError(500, "missing credential");
    }
    const user = await userModel
      .findOne({ email })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "invalid credential");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "invalid credential");
    }

    req.session.userId = user._id;
    res.status(201).json(user);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  try {
    res.status(201);
  } catch (error) {
    next(error);
  }
};

export const logOutUser: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
