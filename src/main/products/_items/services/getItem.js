import Item from "../../../../_rest/models/Item";
import { RouteError } from "../../../../_rest/misc/errors";

export const getItem = async query => {
  const item = await Item.findOne(query, "-__v");
  if (item) return item;
  throw new RouteError(`/products/items/${query._id || ":id"}`);
};
