import { isValidObjectId } from "mongoose";
import { ClientError } from "../../../../_rest/misc/errors";
import Warehouse from "../../../../_rest/models/Warehouse";

/**
 * @param {any} to_warehouse - ID of destination warehouse
 * @param {any} from_warehouse - Where Container is coming from
 */
export const validateWarehouseID = async (to_warehouse, from_warehouse) => {
  if (!isValidObjectId(to_warehouse)) {
    throw new ClientError(`Warehouse ID: ${to_warehouse} invalid`);
  }
  if (to_warehouse === from_warehouse + "") {
    throw new ClientError(
      "Container cannot come from, and be headed to the same warehouse"
    );
  }

  const to = await Warehouse.findOne({ _id: to_warehouse }, "city").lean();
  if (!to) {
    throw new ClientError(`Destination Warehouse does not exist`);
  }
  const from = await Warehouse.findOne({ _id: from_warehouse }, "city").lean();
  if (to.city === from.city) {
    throw new ClientError(
      "Container cannot be sent to a warehouse in the same city"
    );
  }

  return;
};

export const getDateTerm = status => {
  switch (status) {
    case "pending":
      return "ignore";
    case "in transit":
      return "sent";
    case "arrived":
      return "arrived";
    case "discarded":
      return "discarded";
    default:
      throw new Error(`Unexpected Container status: ${status}`);
  }
};
