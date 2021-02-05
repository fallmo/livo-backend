import { validateWarehouseID } from "../utils";
import { validateDeliverer } from "../validation/create";
import Deliverer from "../../../_rest/models/Deliverer";
import User from "../../../_rest/models/User";
import { hashString } from "../../auth/utils/encryption";

/**
 * @param {any} data
 * @param {any} warehouse_id
 */
export const addDeliverer = async (data, warehouse_id) => {
  const fields = await validateDeliverer(data, !warehouse_id);

  if (fields.warehouse) {
    await validateWarehouseID(fields.warehouse);
  }

  const deliverer = await Deliverer.create({
    warehouse: warehouse_id || fields.warehouse,
    status: fields.status,
    options: fields.options,
    active: fields.active,
  });

  const user = await User.create({
    name: fields.name,
    email: fields.email,
    password: await hashString(fields.password), // hashit
    phone: fields.phone,
    government: fields.government,
    role: "deliverer",
    deliverer: deliverer._id,
    active: fields.active ?? true,
  });

  return {
    user: { _id: user._id, name: user.name, email: user.email },
    deliverer,
  };
};
