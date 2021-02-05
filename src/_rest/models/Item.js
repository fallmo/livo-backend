import { Model, model, Schema } from "mongoose";

const schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    pickup: {
      type: Schema.Types.ObjectId,
      ref: "Pickup",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "available",
        "undergoing delivery",
        "undergoing transfer",
        "with deliverer",
      ],
    },
    transfer: {
      type: Schema.Types.ObjectId,
      ref: "Transfer",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    deliverer: {
      type: Schema.Types.ObjectId,
      ref: "Deliverer",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "item",
});

/**
 * @type {Model<import("../types/item").IItem, {}>}
 */
const Item = model("Item", schema);

export default Item;
