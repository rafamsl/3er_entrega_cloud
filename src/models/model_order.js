import { Schema } from "mongoose";

const OrderCollection = "ordenes";

const OrderSchema = new Schema(
  {
    timestamp: { type: String, required: true, max: 100 },
    usuario: { type: Schema.Types.ObjectId, ref: "usuarios" },
    productos: [{product_id: { type: Schema.Types.ObjectId, ref: "productos" }, stock: {type: Number}}]
  },
  {
    virtuals: true,
  }
);  

OrderSchema.set("toJSON", {
  transform: (_, response) => {
    response.id = response._id;
    delete response.__v;
    delete response._id;
    return response;
  },
});

export const OrderModel = { OrderCollection, OrderSchema };