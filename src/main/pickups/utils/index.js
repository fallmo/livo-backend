import { ClientError } from "../../../_rest/misc/errors";
import Product from "../../../_rest/models/Product";
import Deliverer from "../../../_rest/models/Deliverer";
import Warehouse from "../../../_rest/models/Warehouse";
import Client from "../../../_rest/models/Client";

export const validateProductID = async (id, client) => {
  const product = await Product.findOne({ _id: id }, "client").lean();
  if (product) {
    if ("" + product.client === "" + client) return;
    throw new ClientError(`Product: ${id} does not belong to the client`);
  }
  throw new ClientError(`Product: ${id} does not exist`);
};

export const getMainWarehouse = async () => {
  const warehouse = await Warehouse.findOne({ main: true }, "_id").lean();
  if (warehouse) return warehouse._id + "";
  throw new ClientError("No warehouse currently available to accept pickup");
};

export const validateClientID = async id => {
  const exists = await Client.exists({ _id: id });
  if (exists) return;
  throw new ClientError(`Client: ${id} does not exist`);
};

export const validateDelivererID = async id => {
  const exists = await Deliverer.exists({ _id: id });
  if (exists) return;
  throw new Client(`Deliverer: ${id} does not exist`);
};

/**
 * Finds equivalent timestamp key for status
 * @param {string} status - Status of Pickup
 */
export const getDateTerm = status => {
  switch (status) {
    case "in progress":
      return "started";
    case "fulfilled":
      return "fulfilled";
    case "cancelled":
      return "cancelled";
    case "pending":
      return "ignore"; // dont set timestamp for this
    case "problem":
      return "ignore"; // dont set timestamp for this
    default:
      throw new Error(`No Date Changes for status: ${status}`);
  }
};