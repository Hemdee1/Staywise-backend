import { InferId, InferSchemaType, Schema, model } from "mongoose";

const settingsAndPrefSchema = new Schema(
  {
    userId: {},
    notificationPref: {},
    languagePref: {},
    currencyPref: {},
  },
  { timestamps: true }
);

type settings = InferSchemaType<typeof settingsAndPrefSchema>;

export default model<settings>("settings", settingsAndPrefSchema);
