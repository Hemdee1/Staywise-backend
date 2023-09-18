import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import CreateHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
