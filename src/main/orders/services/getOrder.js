import { RouteError } from "../../../_rest/misc/errors";
import Order from "../../../_rest/models/Order";

export const getOrder = async query => {
  const order = await Order.findOne(query, "-__v");
  if (order) return order;
  throw new RouteError(`/orders/${query._id || ":id"}`);
};
