import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Item from "../../../../_rest/models/Item";

export const getItem = async ({ order, ...rest }) => {
  const item = await Item.findOne(rest, "-__v").lean();
  if (item) {
    if (item.order && item.order + "" === order) return item;
    throw new ClientError("Item does not belong to this order");
  }
  throw new RouteError(`/orders/${order || ":id"}/items/${rest._id || ":id"}`);
};
