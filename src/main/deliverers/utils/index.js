import { isValidObjectId } from "mongoose";
import Warehouse from "../../../_rest/models/Warehouse";
import { ClientError } from "../../../_rest/misc/errors";

/**
 * @param {string} id
 */
export const validateWarehouseID = async id => {
  if (isValidObjectId(id)) {
    const exists = await Warehouse.exists({ _id: id });
    if (exists) return;
  }

  throw new ClientError(`Warehouse ${id} does not exist`);
};
