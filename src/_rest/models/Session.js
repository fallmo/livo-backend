import { Schema, Model, model } from "mongoose";

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_accessed: Date,
});

/**
 * @type {Model<import("../types/session").ISession, {}>}
 */
const Session = model("Session", schema);

export default Session;
