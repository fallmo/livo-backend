import { Schema, model, Model } from "mongoose";

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
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
  timestamps: {
    _id: false,
    created: {
      type: Date,
      default: Date.now,
    },
    seen: Date,
  },
});

/**
 * @type {Model<import("../types/message").IMessage, {}>}
 */
const Message = model("Message", schema);

export default Message;
