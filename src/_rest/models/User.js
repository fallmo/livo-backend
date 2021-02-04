import { Model, model, Schema } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  government: {
    _id: false,
    id: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "client", "warehouse", "deliverer"],
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
  active: {
    type: Boolean,
    default: false,
  },
  oneSignal: {
    _id: false,
    push_token: String,
    push_id: String,
  },
  timestamps: {
    _id: false,
    created: {
      type: Date,
      default: Date.now,
    },
  },
});

schema.virtual("notifications", {
  ref: "Notification",
  localField: "_id",
  foreignField: "user",
});

/**
 * @type {Model<import("../types/user").IUser, {}>}
 */
const User = model("User", schema);

export default User;
