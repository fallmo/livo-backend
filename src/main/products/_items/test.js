import { Model, model, Schema, connect } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "product",
});

schema.virtual("history", {
  ref: "Event",
  localField: "_id",
  foreignField: "product",
});

const Product = model("Product", schema);

async function db() {
  await connect("mongodb://localhost:27017/cybo", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

async function test() {
  await db();

  //   const item = await Item.aggregate()
  //     .lookup({
  //       from: "products",
  //       localField: "product",
  //       foreignField: "_id",
  //       as: "product",
  //     })
  //     .unwind({ path: "$product" })
  //     .match({ "product.price": 750 });

  //   console.log(item);
  const products = await Product.aggregate().lookup({
    from: "items",
    localField: "_id",
    foreignField: "product",
    as: "items",
  });
  // .unwind({ path: "$items" })
  // .match({ "items.order": { $exists: false } });
  console.log(products);
}

test();
