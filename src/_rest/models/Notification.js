import { Schema, model, Model } from "mongoose";

const schema = new Schema({
  users: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  link: String,
  seen: {
    type: Boolean,
    default: false,
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
 * @type {Model<import("../types/notification").INotification, {}>}
 */
const Notification = model("Notification", schema);

export default Notification;
