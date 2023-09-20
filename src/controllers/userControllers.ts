import { RequestHandler } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import { hashData } from "../utils/dataHashing";
import bcrypt from "bcrypt";
import { sendOtp } from "../utils/sendOtp";
import uploadImage from "../utils/uploadImage";

const userData = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phoneNumber: "+1 (123) 456-7890",
    password: "hashed_password_1",
    image:
      "https://img.freepik.com/free-photo/man-isolated-showing-emotions-end-gestures_1303-30095.jpg?size=626&ext=jpg",
    emailVerified: true,
  },
  {
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    phoneNumber: "+1 (234) 567-8901",
    password: "hashed_password_2",
    image:
      "https://img.freepik.com/free-photo/african-woman-successful-entrepreneur-wearing-glasses-face-portrait_53876-148050.jpg?size=626&ext=jpg",
    emailVerified: true,
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    phoneNumber: "+1 (345) 678-9012",
    password: "hashed_password_3",
    image:
      "https://img.freepik.com/free-photo/african-american-student-walking-street-talking-phone_1303-12696.jpg?size=626&ext=jpg",
    emailVerified: true,
  },
  {
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma@example.com",
    phoneNumber: "+1 (456) 789-0123",
    password: "hashed_password_4",
    image:
      "https://img.freepik.com/free-photo/stylish-black-girl_1157-15553.jpg?size=626&ext=jpg",
    emailVerified: true,
  },
  {
    firstName: "Sophia",
    lastName: "Anderson",
    email: "sophia@example.com",
    phoneNumber: "+1 (567) 890-1234",
    password: "hashed_password_5",
    image:
      "https://img.freepik.com/free-photo/charismatic-cheerful-attractive-african-american-woman-curly-haircut-wearing-shirt-holding-hands-pockets-confident-outgoing-smiling-talking-pleasant-conversation-feeling-self-assured-relaxed_176420-35345.jpg?size=626&ext=jpg&ga=GA1.2.787050719.1695102715&semt=sph",
    emailVerified: true,
  },
  {
    firstName: "Liam",
    lastName: "Brown",
    email: "liam@example.com",
    phoneNumber: "+1 (678) 901-2345",
    password: "hashed_password_6",
    image:
      "https://img.freepik.com/free-photo/man-black-t-shirt-smiles-sweetly-orange-wall_197531-23228.jpg?size=626&ext=jpg&ga=GA1.2.787050719.1695102715&semt=sph",
    emailVerified: true,
  },
  {
    firstName: "Olivia",
    lastName: "White",
    email: "olivia@example.com",
    phoneNumber: "+1 (789) 012-3456",
    password: "hashed_password_7",
    image:
      "https://img.freepik.com/free-photo/smiling-young-african-woman-standing-grey-wall_171337-19025.jpg?size=626&ext=jpg&ga=GA1.2.787050719.1695102715&semt=sph",
    emailVerified: true,
  },
  {
    firstName: "Ethan",
    lastName: "Lee",
    email: "ethan@example.com",
    phoneNumber: "+1 (890) 123-4567",
    password: "hashed_password_8",
    image:
      "https://img.freepik.com/free-photo/portrait-volunteer-who-organized-donations-charity_23-2149230564.jpg?size=626&ext=jpg&ga=GA1.2.787050719.1695102715&semt=sph",
    emailVerified: true,
  },
  {
    firstName: "Ava",
    lastName: "Johnson",
    email: "ava@example.com",
    phoneNumber: "+1 (901) 234-5678",
    password: "hashed_password_9",
    image:
      "https://img.freepik.com/free-photo/young-handsome-african-business-man-posing-isolated_231208-5502.jpg?size=626&ext=jpg&ga=GA1.2.787050719.1695102715&semt=sph",
    emailVerified: true,
  },
  {
    firstName: "Noah",
    lastName: "Miller",
    email: "noah@example.com",
    phoneNumber: "+1 (012) 345-6789",
    password: "hashed_password_10",
    image:
      "https://img.freepik.com/free-photo/positive-overjoyed-dark-skinned-man-points-with-both-index-fingers-hints-something-wears-casual-green-jumper-smiles-broadly_273609-23582.jpg?size=626&ext=jpg&ga=GA1.2.787050719.1695102715&semt=sph",
    emailVerified: true,
  },
];

export const sendData: RequestHandler = async (req, res) => {
  try {
    const data = await userModel.insertMany(userData);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

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
      res.status(500).json("password must be at least 8 characters");
      throw createHttpError(500, "password must be at least 8 characters");
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

    // send the otp for verification
    const otpDetails = {
      email,
      subject: "Email verification",
      message: "verify your email with the code below",
      duration: 1,
    };

    await sendOtp(otpDetails);
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
      throw createHttpError(500, "missing credential");
    }
    const user = await userModel
      .findOne({ email })
      .select("+password +email")
      .exec();

    if (!user) {
      res.status(500).json("Invalid credentials");
      throw createHttpError(401, "Invalid credentials");
    }

    if (user.emailVerified == false) {
      res
        .status(500)
        .json({ email: "Email has not been verified yet, check your inbox" });
      throw createHttpError(
        500,
        "Email has not been verified yet, check your inbox"
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  const id = req.session.userId;
  const body = req.body;
  try {
    const img = req.body.img;

    const user = await userModel.findById(id);

    if (!user) {
      res.status(500).json("User not found");
      throw createHttpError(401, "User not found");
    }

    // check for new image and upload to cloudinary
    if (img && user.image !== img) {
      const res = await uploadImage(id, img);

      // public_id = 'user-images/'+ user._id
      // e.g 'user-images/63e57c70aaa573dc514a739b'

      req.body.img = res?.secure_url;
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      image,
      emailVerified,
    } = user;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        image,
        emailVerified,
        ...body,
      },
      { new: true }
    );
    res.status(201).json(updatedUser);
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
