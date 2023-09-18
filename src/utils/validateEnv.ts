import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  MONGO_URL: str(),
  PORT: port(),
});

export default env;
