import { Model, model, Schema } from "mongoose";

const schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["credit", "debit"],
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fulfilled: {
    type: Boolean,
    default: false,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
  },
  deliverer: {
    type: Schema.Types.ObjectId,
    ref: "Deliverer",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  pickup: {
    type: Schema.Types.ObjectId,
    ref: "Pickup",
  },
  transfer: {
    type: Schema.Types.ObjectId,
    ref: "Transfer",
  },
  timestamps: {
    _id: false,
    created: {
      type: Date,
      default: Date.now,
    },
    fulfilled: Date,
  },
});

/**
 * @type {Model<import("../types/payment").IPayment, {}>}
 */
const Payment = model("Payment", schema);

export default Payment;
