import Product from "../../../_rest/models/Product";
import Deliverer from "../../../_rest/models/Deliverer";
import Item from "../../../_rest/models/Item";
import { isValidObjectId, Types } from "mongoose";
import { ClientError } from "../../../_rest/misc/errors";

export const lightValidateProductID = async (product_id, client_id) => {
  if (!isValidObjectId(product_id)) {
    throw new ClientError(`Product: ${product_id} is not valid`);
  }

  const product = await Product.findOne(
    { _id: product_id },
    "client price"
  ).lean();

  if (!product) {
    throw new ClientError(`Product: ${product_id} does not exist`);
  }

  if (product.client + "" !== client_id) {
    throw new ClientError(`Product: ${product_id} does not belong to client`);
  }
  return product.price;
};

export const validateProductID = async (product_id, quantity, city) => {
  const items = await Item.aggregate()
    .match({
      product: new Types.ObjectId(product_id),
      status: { $in: ["available", "with deliverer"] },
    })
    .lookup({
      from: "warehouses",
      localField: "warehouse",
      foreignField: "_id",
      as: "warehouse",
    })
    .match({ "warehouse.city": city })
    .count("count");

  const present = items[0]?.count || 0;
  if (present >= quantity) return {};

  const transfer = await findTransfer(product_id, quantity - present, city);
  if (transfer) return { transfer };

  throw new ClientError(`Insufficient stock of ${product_id}`);
};

export const findTransfer = async (product_id, missing, city) => {
  const options = await Item.aggregate()
    .match({
      product: new Types.ObjectId(product_id),
      status: { $in: ["available", "with deliverer"] },
    })
    .lookup({
      from: "warehouses",
      localField: "warehouse",
      foreignField: "_id",
      as: "warehouse",
    })
    .match({
      "warehouse.city": { $ne: city },
      $or: [
        { "warehouse.main": true },
        { "warehouse.options.transfer_out": true },
      ],
    })
    .unwind({ path: "$warehouse" })
    .group({ _id: "$warehouse.city", count: { $sum: 1 } })
    .match({ count: { $gte: missing } })
    .sort("count")
    .project({ _id: 0, "city": "$_id", count: 1 });

  if (options.length) {
    return {
      from_city: options[0].city,
      product: product_id,
      quantity: missing,
    };
  }
};

/**
 *
 * @param {{from_city: string, product: string, quantity: number}[]} data
 * @returns {{from_city: string, products: {product: string, quantity: number}[]}[]}
 */
export const combineTransfers = data => {
  const combined = {};

  for (const { from_city, product, quantity } of data) {
    if (!combined[from_city]) {
      combined[from_city] = [];
    }
    combined[from_city].push({ product, quantity });
  }

  return Object.keys(combined).map(city => ({
    from_city: city,
    products: combined[city],
  }));
};

export const validateDelivererID = async id => {
  if (!isValidObjectId(id)) {
    throw new ClientError(`Deliverer: ${id} is not valid`);
  }
  const exists = await Deliverer.exists({ _id: id });
  if (exists) return;
  throw new ClientError(`Deliverer: ${id} does not exist`);
};

/**
 * @param {any[]} products
 * @param {any[]} items
 */
export const ensureOrderReady = async (products, items) => {
  for (const { product, quantity } of products) {
    await ensureProductQuantity(product, quantity, items);
  }
};

/**
 * @param {any} product - The Product ID Requested
 * @param {number} quantity - The Quantity Requested
 * @param {any[]} items - The Items Currently
 */
const ensureProductQuantity = async (product, quantity, items) => {
  const total = items.reduce((acc, curr) => {
    if (curr.product + "" === product + "") return acc + 1;
    else return acc + 0;
  }, 0);

  if (total !== quantity) {
    const { name } = await Product.findOne({ _id: product }, "name").lean();
    throw new ClientError(
      `Requested ${quantity} items of ${name}; instead got ${total}`
    );
  }
};

/**
 * @param {*} order
 */
export const generateScore = async order => {
  // for now;
  return 100;
};

/**
 * @param {*} order_id
 * @param {*} order_status
 * @param {*} [deliverer]
 */
export const updateItems = async (order_id, order_status, deliverer) => {
  const change = {};
  switch (order_status) {
    case "fulfilled":
      change["status"] = "delivered";
      break;
    case "draft":
      if (!deliverer) {
        throw new Error(
          "Deliverer is required after when returning order to draft"
        );
      }
      change["status"] = "with deliverer";
      change["order"] = undefined;
      change["deliverer"] = deliverer;
      break;
    default:
      throw new Error(`Unexpected order status: ${order_status}`);
  }

  //@ts-ignore
  await Item.updateMany({ order: order_id }, change);
};
