import { Schema } from "mongoose";

const MessageCollection = "messages";

const MessageSchema = new Schema(
  {
    text: { type: String, required: true, max: 280 },
    author: { type: String, required: true, max: 280 },
    timestamp: { type: String, required: true, max: 100 },
  },
  {
    virtuals: true,
  }
);

MessageSchema.set("toJSON", {
  transform: (_, response) => {
    response.id = response._id;
    delete response.__v;
    delete response._id;
    return response;
  },
});

export const MessageModel = { MessageCollection, MessageSchema };