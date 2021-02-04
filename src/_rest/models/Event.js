import { Model, model, Schema } from "mongoose";

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  transfer: {
    type: Schema.Types.ObjectId,
    ref: "Transfer",
  },
  pickup: {
    type: Schema.Types.ObjectId,
    ref: "Pickup",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  timestamps: {
    _id: false,
    created: {
      type: Date,
      default: Date.now,
    },
  },
});

/**
 * @type {Model<import("../types/event").IEvent, {}>}
 */
const Event = model("Event", schema);

export default Event;
