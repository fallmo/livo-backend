import Item from "../../../../_rest/models/Item";
import { Types } from "mongoose";

export const getItems = async (query = {}) => {
  if (query.client) {
    return await Item.aggregate()
      .lookup({
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      })
      .unwind({ path: "$product" })
      .match({ "product.client": new Types.ObjectId(query.client) });
  } else {
    return await Item.find({ ...query, client: undefined }, "-__v -pickup");
  }
};
