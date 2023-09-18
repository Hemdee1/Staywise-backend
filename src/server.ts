import mongoose from "mongoose";
import app from "./app";

mongoose
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .connect(process.env.MONGO_CONNECTION_STRING!)
  .then(() => {
    console.log("mongoose connected");
    app.listen(process.env.PORT, () => {
      console.log(`connected to ${process.env.PORT}`);
    });
  })
  .catch(console.error);
