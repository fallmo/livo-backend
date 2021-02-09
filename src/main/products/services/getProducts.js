import { Types } from "mongoose";
import Product from "../../../_rest/models/Product";

export const getProducts = async (query = {}) => {
  if (query.warehouse) {
    return await Product.aggregate()
      .lookup({
        from: "items",
        localField: "_id",
        foreignField: "product",
        as: "items",
      })
      .match({ "items.warehouse": new Types.ObjectId(query.warehouse) })
      .project({ name: 1, price: 1, sku: 1 });
  }

  if (query.deliverer) {
    return await Product.aggregate()
      .lookup({
        from: "items",
        localField: "_id",
        foreignField: "product",
        as: "items",
      })
      .match({ "items.deliverer": new Types.ObjectId(query.deliverer) })
      .project({ name: 1, price: 1, sku: 1 });
  }

  return await Product.find(query, "name price sku");
};
