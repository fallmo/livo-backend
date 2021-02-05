import { ClientError } from "../../../_rest/misc/errors";
import Client from "../../../_rest/models/Client";

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
