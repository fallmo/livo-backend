import { hashString } from "../../auth/utils/encryption";
import { RouteError } from "../../../_rest/misc/errors";
import User from "../../../_rest/models/User";
import {
  validateClientID,
  validateUserEmail,
  validateWarehouseID,
} from "../utils";
import { validateEditUser } from "../validation/edit";

/**
 * @param {string} id - User ID
 * @param {any} data
 * @param {boolean} admin - Whether user is admin
 */
export const editUser = async (id, data, admin) => {
  const user = await User.findOne({ _id: id }, "-__v -date_created");
  if (!user) {
    throw new RouteError(`/users/${id}`);
  }

  const fields = await validateEditUser(data, admin);

  if (fields.client) {
    await validateClientID(fields.client);
  }

  if (fields.warehouse) {
    await validateWarehouseID(fields.warehouse);
  }

  if (fields.email) {
    await validateUserEmail(fields.email, false);
    // send confirmation
  }

  if (fields.password) {
    fields.password = await hashString(fields.password);
  }

  const toReturn = { _id: user._id, name: user.name };

  for (const key in fields) {
    if (key === "password") continue;
    if (typeof fields[key] === "object") {
      user[key] = { ...user[key], ...fields[key] };
    } else {
      user[key] = fields[key];
    }
    toReturn[key] = user[key];
  }

  await user.save();
  return toReturn;
};

/// stop admins from being able to edit other admins status
