import { Model, model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "product",
});

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "product",
});

/**
 * @type {Model<import("../types/product").IProduct, {}>}
 */
const Product = model("Product", schema);

export default Product;
