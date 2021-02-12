import { isValidObjectId, Types } from "mongoose";
import { ClientError } from "../../../_rest/misc/errors";
import Container from "../../../_rest/models/Container";
import Product from "../../../_rest/models/Product";
import Order from "../../../_rest/models/Order";
import Item from "../../../_rest/models/Item";
import Warehouse from "../../../_rest/models/Warehouse";

/**
 * @param {*} id - Container ID
 * @param {string} origin - Transfer From City
 * @param {string} destination - Transfer To City
 * @param {any} warehouse - Warehouse making request
 */
export const validateContainerID = async (
  id,
  origin,
  destination,
  warehouse
) => {
  if (!isValidObjectId(id)) {
    throw new ClientError(`Container id: ${id} is not valid`);
  }
  const container = await Container.findOne({ _id: id }, "-__v -timestamps")
    .populate("to_warehouse", "city")
    .populate("from_warehouse", "city");

  if (!container) {
    throw new ClientError(`Container: ${id} does not exist`);
  }
  if (container.from_warehouse._id + "" !== warehouse) {
    throw new ClientError(`Container does not belong to warehouse`);
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

export const validateProductID = async (
  client_id,
  product_id,
  quantity,
  city
) => {
  if (!isValidObjectId(product_id)) {
    throw new ClientError(`Product: ${product_id} is not valid`);
  }

  const product = await Product.findOne(
    { _id: product_id },
    "name client price"
  ).lean();

  if (!product) {
    throw new ClientError(`Product ${product_id} does not exist`);
  }

  if (product.client + "" !== client_id) {
    throw new ClientError(`Product ${product_id} does not belong to client`);
  }

  const items = await Item.aggregate()
    .match({
      product: new Types.ObjectId(product_id),
      status: "available",
    })
    .lookup({
      from: "warehouses",
      localField: "warehouse",
      foreignField: "_id",
      as: "warehouse",
    })
    .unwind({ path: "$warehouse" })
    .match({ "warehouse.city": city })
    .count("count");

  const sufficient = items.length && items[0].count >= quantity;
  if (sufficient) return;
  throw new ClientError(
    `Insufficient stock of ${product.name} in city ${city}`
  );
};

/**
 * @param {any} id - Transfer ID
 * @param {string} [new_warehouse] - New Warehouse (after transfer)
 */
export const freeItems = async (id, new_warehouse) => {
  const items = await Item.find({ transfer: id }, "transfer status");
  for (const item of items) {
    item.transfer = undefined;
    item.status = "available";
    if (new_warehouse) item.warehouse = new_warehouse;
    await item.save();
  }
};
