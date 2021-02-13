import { query } from "express";
import { RouteError } from "../../../_rest/misc/errors";
import Order from "../../../_rest/models/Order";

export const getOrder = async (query, deliverer) => {
  const order = await Order.findOne(query, "-__v");
  if (order) {
    if (deliverer && order.deliverer + "" !== deliverer) {
      order.target.name = undefined;
      order.target.phone = undefined;
      order.client = undefined;
    }
    return order;
  }
  throw new RouteError(`/orders/${query._id || ":id"}`);
};
