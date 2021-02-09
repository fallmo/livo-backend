import { Schema, model, Model } from "mongoose";

const schema = new Schema(
  {
    from_warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    to_warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in transit", "arrived", "discarded"],
      default: "pending",
    },
    timestamps: {
      _id: false,
      created: {
        type: Date,
        default: Date.now,
      },
      sent: Date,
      arrived: Date,
      discarded: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("transfers", {
  ref: "Transfer",
  localField: "_id",
  foreignField: "transfer",
});

/**
 * @type {Model<import("../types/container").IContainer, {}>}
 */
const Container = model("Container", schema);

export default Container;
