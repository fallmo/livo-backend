import Client from "../../../_rest/models/Client";
import { validateBrandName } from "../utils";
import { validateClient } from "../validation/create";

/**
 *
 * @param {any} data
 * @returns {Promise<{_id: string, brand: any, location: any}>}
 */
export const addClient = async data => {
  const fields = await validateClient(data);

  await validateBrandName(fields.brand.name);

  const client = await Client.create(fields);

  return {
    _id: client._id,
    brand: client.brand,
    location: client.location,
  };
};
