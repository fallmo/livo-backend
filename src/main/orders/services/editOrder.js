import { RouteError } from "../../../_rest/misc/errors";
import Order from "../../../_rest/models/Order";
import Transfer from "../../../_rest/models/Transfer";
import {
  combineTransfers,
  ensureOrderReady,
  generateScore,
  lightValidateProductID,
  validateDelivererID,
  validateProductID,
  updateItems,
} from "../utils";
import { validateEditOrder } from "../validation/edit";

export const editOrder = async (id, data, user) => {
  const order = await Order.findOne({ _id: id }, "-__v");
  if (!order) {
    throw new RouteError(`/orders/${id}`);
  }

  let transfers = [];

  const fields = await validateEditOrder(data, user.role, order.status);

  if (fields.cost) {
    order.cost = fields.cost;
  }
  if (fields.desired_date) {
    order.desired_date = fields.desired_date;
  }
  if (fields.openable) {
    order.openable = fields.openable;
  }
  if (fields.target) {
    order.target = fields.target;
  }
  if (typeof fields.deliverer !== "undefined") {
    if (fields.deliverer) {
      await validateDelivererID(fields.deliverer);
      order.deliverer = fields.deliverer;
    } else {
      order.deliverer = undefined;
    }
  }

  if (fields.products) {
    let calculatedCost = 0;
    for (const { product, quantity } of fields.products) {
      const price = await lightValidateProductID(product, user.client);
      calculatedCost += price * quantity;
    }
    if (!fields.cost) {
      order.cost = calculatedCost;
    }
  }

  if (fields.status) {
    if (fields.status === "pending") {
      for (const { product, quantity } of order.products) {
        const { transfer } = await validateProductID(
          product,
          quantity,
          order.target.city
        );
        transfer && transfers.push(transfer);
      }
      order.status = transfers.length ? "awaiting transfer" : "pending";
    }
    if (fields.status === "in progress") {
      await order.populate("items", "product").execPopulate();
      await ensureOrderReady(order.products, order.items);
      order.deliverer = user.deliverer;
      order.status = "in progress";
    }

    if (fields.status === "fulfilled") {
      order.status = "fulfilled";
      order.score = await generateScore(order);
      await updateItems(order._id, "fulfilled");
    }
    if (fields.status === "draft") {
      order.status = "draft";
      await updateItems(order._id, "draft", order.deliverer);
    }
  }
  await order.save();
  if (transfers.length) {
    transfers = combineTransfers(transfers);
    // could reformat for insertMany...
    for (const transfer of transfers) {
      await Transfer.create({
        ...transfer,
        client: order.client,
        to_city: order.target.city,
        order: order._id,
      });
    }
  }

  return order;
};
