import { isValidObjectId } from "mongoose";
import { ClientError } from "../../../_rest/misc/errors";
import User from "../../../_rest/models/User";
import Client from "../../../_rest/models/Client";
import Warehouse from "../../../_rest/models/Warehouse";
import Deliverer from "../../../_rest/models/Deliverer";

/**

 * @param {Object} query
 * @returns {Promise<boolean>}
 */
export const userExists = async query => {
  return await User.exists(query);
};

/**
 *
 * @param {string} email
 * @param {boolean} [exists] - Whether to expect the user to exist. If true throws error if email doesn't exist. If false throws error if email exists
 */
export const validateUserEmail = async (email, exists) => {
  const userExists = await User.exists({ email });
  if (!userExists && exists) {
    throw new ClientError("user with this email does not exist");
  } else if (userExists && !exists) {
    throw new ClientError("user with this email already registered");
  }
};

/**
 * @param {string} id
 */
export const validateClientID = async id => {
  if (isValidObjectId(id)) {
    const exists = await Client.exists({ _id: id });
    if (exists) return;
  }

  throw new ClientError("Client with this _id does not exist");
};

/**
 * @param {string} id
 */
export const validateWarehouseID = async id => {
  if (isValidObjectId(id)) {
    const exists = await Warehouse.exists({ _id: id });
    if (exists) return;
  }
  throw new ClientError("Warehouse with this _id does not exist");
};

/**
 * @param {string} id
 */
export const validateDelivererID = async id => {
  if (isValidObjectId(id)) {
    const exists = await Deliverer.exists({ _id: id });
    if (exists) return;
  }
  throw new ClientError("Deliverer with this _id does not exist");
};
