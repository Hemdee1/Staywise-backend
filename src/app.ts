import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import NoteRoutes from "./routes/noteRoutes";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/notes", NoteRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "No route found"));
});

// GLOBAL ERROR HANDLING
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occured";
  let statusCode = 500;

  if (isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.status;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
