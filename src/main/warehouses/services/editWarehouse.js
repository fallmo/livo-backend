import { RouteError } from "../../../_rest/misc/errors";
import Warehouse from "../../../_rest/models/Warehouse";
import { validateWarehouseMain, validateWarehouseName } from "../utils";
import { validateEditWarehouse } from "../validation/edit";

/**
 * @param {string} id - Warehouse ID
 * @param {any} data
 */
export const editWarehouse = async (id, data) => {
  const warehouse = await Warehouse.findOne({ _id: id }, "-__v -city");
  if (!warehouse) {
    throw new RouteError(`/warehouses/${id}`);
  }

  const fields = await validateEditWarehouse(data);

  if (fields.name) {
    await validateWarehouseName(fields.name);
  }
  if (fields.main) {
    await validateWarehouseMain();
  }

  const toReturn = { _id: warehouse._id, name: warehouse.name };

  for (const key in fields) {
    if (typeof fields[key] === "object") {
      warehouse[key] = { ...warehouse[key], ...fields[key] };
    } else {
      warehouse[key] = fields[key];
    }
    toReturn[key] = warehouse[key];
  }

  await warehouse.save();

  return toReturn;
};
