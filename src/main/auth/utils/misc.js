import User from "../../../_rest/models/User";
import Client from "../../../_rest/models/Client";
import { ClientError } from "../../../_rest/misc/errors";

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
 * Ensures Brand Name is Unique
 * @param {string} brand_name
 */
export const validateBrandName = async brand_name => {
  const exists = await Client.exists({ "brand.name": brand_name });
  if (exists) {
    throw new ClientError("brand name already registered");
  }
};
