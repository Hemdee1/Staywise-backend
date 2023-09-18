import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import CreateHttpError, { isHttpError } from "http-errors";
import userRoute from "./routes/userRoutes";
import session from "express-session";
import MongoStore from "connect-mongo";
import { requestAuth } from "./mildlewares/auth";
import env from "./utils/validateEnv";
import otpRoute from "./otpSystem/route";
import emailVerificationRoute from "./emailVetification/route";
import apartmentRoutes from "./routes/apartmentListingRoutes";
import bookingRoutes from "./routes/bookingRoute";

const app = express();

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/otp", otpRoute);
app.use("/emailVerification", emailVerificationRoute);
app.use("/apartment", apartmentRoutes);
app.use("/booking", bookingRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMesage = "an unknown error has occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMesage = error.message;

    res.status(statusCode).json(errorMesage);
  }
});

app.use((req, res, next) => {
  res.status(404).json("endpoint not found");
  next(CreateHttpError(404, "endpoint not found"));
});
export default app;
