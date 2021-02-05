import { model, Model, Schema } from "mongoose";

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
      required: true,
      enum: ["pending", "in progress", "fulfilled", "cancelled"],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    container: {
      type: Schema.Types.ObjectId,
      ref: "Container",
    },
    products: {
      _id: false,
      required: true,
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    timestamps: {
      _id: false,
      requested: {
        type: Date,
        default: Date.now,
      },
      started: Date,
      fulfilled: Date,
      cancelled: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "transfer",
});

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "transfer",
});

schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "transfer",
});

/**
 * @type {Model<import("../types/transfer").ITransfer, {}>}
 */
const Transfer = model("Transfer", schema);

export default Transfer;
