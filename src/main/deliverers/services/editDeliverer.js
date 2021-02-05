import { RouteError } from "../../../_rest/misc/errors";
import Deliverer from "../../../_rest/models/Deliverer";
import { validateWarehouseID } from "../utils";
import { validateEditDeliverer } from "../validation/edit";

/**
 * @param {string} id
 * @param {any} data
 * @param {string} role - Whether user is admin
 */

export const editDeliverer = async (id, data, role) => {
  const deliverer = await Deliverer.findOne({ _id: id }, "-__v");

  if (!deliverer) {
    throw new RouteError(`/deliverers/${id}`);
  }

  const fields = await validateEditDeliverer(data, deliverer.status, role);

  if (fields.warehouse) {
    await validateWarehouseID(fields.warehouse);
  }

  const toReturn = { _id: deliverer._id };

  for (const key in fields) {
    if (typeof fields[key] === "object") {
      deliverer[key] = { ...deliverer[key], ...fields[key] };
    } else {
      deliverer[key] = fields[key];
    }
    toReturn[key] = deliverer[key];
  }

  await deliverer.save();

  return toReturn;
};
