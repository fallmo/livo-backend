import { ClientError } from "../../../_rest/misc/errors";
import Warehouse from "../../../_rest/models/Warehouse";

/**
 * @param {string} name
 */
export const validateWarehouseName = async name => {
  const exists = await Warehouse.exists({ name });
  if (exists) {
    throw new ClientError("warehouse name must be unique");
  }
};

export const validateWarehouseMain = async () => {
  const exists = await Warehouse.exists({ main: true });
  if (exists) {
    throw new ClientError("There is already a main warehouse");
  }
};
