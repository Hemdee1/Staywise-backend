import mongoose from "mongoose";
import app from "./app";
import env from "./utils/validateEnv";

const MONGO_URL = env.MONGO_URL;
const PORT = env.PORT;

mongoose.connect(MONGO_URL).then(() => {
  app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
  });
});
