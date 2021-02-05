import { ClientError } from "../../../_rest/misc/errors";
import User from "../../../_rest/models/User";
import {
  userExists,
  validateClientID,
  validateDelivererID,
  validateWarehouseID,
} from "../utils";
import { validateUser } from "../validation/create";
import { hashString } from "../../auth/utils/encryption";

export const addUser = async data => {
  const fields = await validateUser(data);

  if (fields.client) {
    await validateClientID(fields.client);
  }

  if (fields.warehouse) {
    await validateWarehouseID(fields.warehouse);
  }

  if (fields.deliverer) {
    await validateDelivererID(fields.deliverer);
  }

  if (await userExists({ email: fields.email })) {
    throw new ClientError("user email already registered");
  }

  const user = await User.create({
    ...fields,
    password: await hashString(fields.password),
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    client: user.client,
    warehouse: user.warehouse,
    deliverer: user.deliverer,
  };
};
