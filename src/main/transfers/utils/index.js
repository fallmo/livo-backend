import { isValidObjectId } from "mongoose";
import { ClientError } from "../../../_rest/misc/errors";
import Container from "../../../_rest/models/Container";
import Product from "../../../_rest/models/Product";
import Order from "../../../_rest/models/Order";
import Item from "../../../_rest/models/Item";

/**
 * @param {*} id
 * @param {string} origin
 * @param {string} destination
 */
export const validateContainerID = async (id, origin, destination) => {
  if (!isValidObjectId(id)) {
    throw new ClientError(`Container id: ${id} is not valid`);
  }
  const container = await Container.findOne({ _id: id }, "-__v -timestamps")
    .populate("to_warehouse", "city")
    .populate("from_warehouse", "city");

  if (!container) {
    throw new ClientError(`Container: ${id} does not exist`);
  }

  if (container.status !== "pending") {
    throw new ClientError(
      `Container with status: ${container.status} cannot be added`
    );
  }
  //@ts-ignore
  if (container.from_warehouse.city !== origin) {
    throw new ClientError(
      //@ts-ignore
      `Container origin and transfer origin do not match: (${container.from_warehouse.city}: ${origin})`
    );
  }

  //@ts-ignore
  if (container.to_warehouse.city !== destination) {
    throw new ClientError(
      //@ts-ignore
      `Container destination and transfer destination do not match: (${container.to_warehouse.city}: ${destination})`
    );
  }

  return; //unecessary
};

export const validateProductID = async (id, client) => {
  if (isValidObjectId(id)) {
    const product = await Product.findOne({ _id: id }, "client").lean();
    if (product) {
      if ("" + product.client === "" + client) return;
      throw new ClientError(`Product: ${id} does not belong to the client`);
    }
  }
  throw new ClientError(`Product: ${id} does not exist`);
};

export const validateOrderID = async (id, client) => {
  if (isValidObjectId(id)) {
    const order = await Order.findOne({ _id: id }, "client status").lean();
    if (order) {
      if ("" + order.client === "" + client) {
        if (order.status === "awaiting transfer") return;
        throw new ClientError(
          `Order with status: ${order.status} cannot be added to transfer`
        );
      }
      throw new ClientError(`Order: ${id} does not belong to the client`);
    }
  }
  throw new ClientError(`Order: ${id} does not exist`);
};

/**
 * @param {any} id - Transfer ID
 */
export const freeItems = async id => {
  const items = await Item.find({ transfer: id }, "transfer status");
  console.log(items);
  for (const item of items) {
    item.transfer = undefined;
    item.status = "available";
    await item.save();
  }
};
