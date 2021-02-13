import { isValidObjectId } from "mongoose";
import Transfer from "../../../../_rest/models/Transfer";
import Product from "../../../../_rest/models/Product";
import { ClientError } from "../../../../_rest/misc/errors";
import Warehouse from "../../../../_rest/models/Warehouse";
import { freeItems } from "../../utils";
import Order from "../../../../_rest/models/Order";

/**
 * @param {any} to_warehouse - ID of destination warehouse
 * @param {any} from_warehouse - Where Container is coming from
 */
export const validateWarehouseID = async (to_warehouse, from_warehouse) => {
  const from = await Warehouse.findOne(
    { _id: from_warehouse },
    "city options"
  ).lean();

  if (!from?.options?.transfer_out) {
    throw new ClientError(`You are not allowed to make transfers`);
  }

  if (!isValidObjectId(to_warehouse)) {
    throw new ClientError(`Warehouse ID: ${to_warehouse} invalid`);
  }
  if (to_warehouse === from_warehouse + "") {
    throw new ClientError(
      "Container cannot come from, and be headed to the same warehouse"
    );
  }

  const to = await Warehouse.findOne(
    { _id: to_warehouse },
    "city options"
  ).lean();

  if (!to) {
    throw new ClientError(`Destination Warehouse does not exist`);
  }

  if (to.city === from.city) {
    throw new ClientError(
      "Container cannot be sent to a warehouse in the same city"
    );
  }

  if (!to.options?.transfer_in) {
    throw new ClientError(`Destination Warehouse cannot accept transfers`);
  }

  return;
};

/**
 * @param {any} id - ID of Container
 */
export const ensureTransfersReady = async id => {
  const transfers = await Transfer.find(
    { container: id },
    "products items"
  ).populate("items", "product");

  if (!transfers?.length) {
    throw new ClientError(`Transfers must be added to container`);
  }

  for (const transfer of transfers) {
    for (const { product, quantity } of transfer.products) {
      await ensureProductQuantity(product, quantity, transfer.items);
    }
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
 * Updates Transfer Statuses to Match Container's
 * @param {any} id - ID of container
 * @param {string} status - Status of Container
 * @param {any} to_warehouse - Destination of Container
 */
export const updateTransfers = async (id, status, to_warehouse) => {
  const transfers = await Transfer.find({ container: id }, "status order");
  const transfer_status = matchContainerStatus(status);

  for (const transfer of transfers) {
    transfer.status = transfer_status;
    if (status === "discarded") {
      transfer.container = undefined;
      await freeItems(transfer._id);
    }
    await transfer.save();
    if (transfer_status === "fulfilled") {
      await freeItems(transfer._id, to_warehouse);
      await handleTransferOrder(transfer.order, transfer._id);
    }
  }
};

const matchContainerStatus = status => {
  switch (status) {
    case "pending":
      return "pending";
    case "in transit":
      return "in progress";
    case "arrived":
      return "fulfilled";
    case "discarded":
      return "pending";
    default:
      throw new Error(`Unexpected Container Status: ${status}`);
  }
};

const handleTransferOrder = async (order_id, transfer_id) => {
  if (!order_id) return;
  const another_transfer = await Transfer.exists({
    _id: { $ne: transfer_id },
    status: { $nin: ["fulfilled", "cancelled"] },
    order: order_id,
  });
  if (another_transfer) return;
  await Order.findOneAndUpdate(
    { _id: order_id, status: "awaiting transfer" },
    { status: "pending" }
  );
};
