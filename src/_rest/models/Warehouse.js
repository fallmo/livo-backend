import { Schema, Model, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    main: {
      type: Boolean,
      default: false,
    },
    fees: {
      _id: false,
      order: Number,
      pickup: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "warehouse",
});
schema.virtual("pickups", {
  ref: "Pickup",
  localField: "_id",
  foreignField: "warehouse",
});
schema.virtual("transfers.outgoing", {
  ref: "Transfer",
  localField: "_id",
  foreignField: "from_warehouse",
});
schema.virtual("transfers.incoming", {
  ref: "Item",
  localField: "_id",
  foreignField: "to_warehouse",
});
schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "warehouse",
});
schema.virtual("managers", {
  ref: "User",
  localField: "_id",
  foreignField: "warehouse",
});

schema.virtual("deliverers", {
  ref: "Deliverer",
  localField: "_id",
  foreignField: "warehouse",
});

// schema.virtual("balance").get(() => {
//   // add the payments;;
//   return 0;
// });

/**
 * @type {Model<import("../types/warehouse").IWarehouse, {}>}
 */
const Warehouse = model("Warehouse", schema);

export default Warehouse;
