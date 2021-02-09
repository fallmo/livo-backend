import { model, Schema, connect } from "mongoose";

const schema2 = new Schema({
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

const Session = model("Session", schema2);

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

  const product = await Product.findOne({}, "test");
  console.log(product.test);
}

test();

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
