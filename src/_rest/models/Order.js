import { Model, model, Schema } from "mongoose";

const schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "draft",
      enum: [
        "draft",
        "pending",
        "in progress",
        "fulfilled",
        "problem",
        "awaiting transfer",
        "cancelled",
      ],
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
    openable: {
      type: Boolean,
      default: false,
    },
    deliverer: {
      type: Schema.Types.ObjectId,
      ref: "Deliverer",
    },
    desired_date: Date,
    score: Number,
    target: {
      _id: false,
      required: true,
      type: {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        zone: {
          type: String,
          required: true,
        },
      },
    },
    timestamps: {
      _id: false,
      drafted: {
        type: Date,
        default: Date.now,
      },
      requested: Date,
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
  foreignField: "order",
});

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "order",
});

schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "order",
});

schema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "order",
});

/**
 * @type {Model<import("../types/order").IOrder, {}>}
 */
const Order = model("Order", schema);

export default Order;
