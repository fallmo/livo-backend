import { model, Model, Schema } from "mongoose";

const schema = new Schema({
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "available",
      "unavailable",
      "performing pickup",
      "performing delivery",
    ],
  },
  options: {
    _id: false,
    zones: [String],
    pickups: {
      type: Boolean,
      default: true,
    },
    orders: {
      type: Boolean,
      default: true,
    },
  },
});

schema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "deliverer",
});

schema.virtual("user", {
  ref: "User",
  localField: "_id",
  foreignField: "deliverer",
  justOne: true,
});

schema.virtual("pickups", {
  ref: "Pickup",
  localField: "_id",
  foreignField: "deliverer",
});

schema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "deliverer",
});

schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "deliverer",
});

schema.virtual("balance").get(() => {
  // add payments;
  return 0;
});

schema.virtual("score").get(() => {
  // add order scores;
  return 0;
});

/**
 * @type {Model<import("../types/deliverer").IDeliverer, {}>}
 */
const Deliverer = model("Deliverer", schema);

export default Deliverer;
