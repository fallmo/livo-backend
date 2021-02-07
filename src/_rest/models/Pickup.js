import { Model, model, Schema } from "mongoose";

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["paid", "free"],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in progress", "fulfilled", "problem", "cancelled"],
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
    deliverer: {
      type: Schema.Types.ObjectId,
      ref: "Deliverer",
    },
    desired_date: Date,
    target: {
      _id: false,
      required: false,
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

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "pickup",
});

schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "pickup",
});

schema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "pickup",
});

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "pickup",
});

/**
 * @type {Model<import("../types/pickup").IPickup, {}>}
 */
const Pickup = model("Pickup", schema);

export default Pickup;
