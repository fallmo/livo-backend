import { model, Model, Schema } from "mongoose";

const schema = new Schema(
  {
    membership: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },
    active: {
      type: Boolean,
      default: false,
    },
    brand: {
      _id: false,
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
      },
    },
    location: {
      _id: false,
      city: {
        type: String,
        required: true,
      },
      zone: {
        type: String,
        required: true,
      },
    },
    account: {
      _id: false,
      rib: {
        type: String,
        required: true,
      },
      bank_name: {
        type: String,
        required: true,
      },
      automatic_cashout: Number,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "client",
});

schema.virtual("managers", {
  ref: "Users",
  localField: "_id",
  foreignField: "client",
});

schema.virtual("balance.available").get(() => {
  // add fulfilled payments
  return 0;
});

schema.virtual("balance.pending").get(() => {
  // add payments
  return 0;
});

/**
 * @type {Model<import("../types/client").IClient, {}>}
 */
const Client = model("Client", schema);

export default Client;
