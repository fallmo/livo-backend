import { RouteError } from "../../../_rest/misc/errors";
import Client from "../../../_rest/models/Client";
import { validateBrandName } from "../utils";
import { validateEditClient } from "../validation/edit";

/**
 *
 * @param {string} id - ID of Client
 * @param {any} data
 * @param {boolean} admin - Whether user is admin
 */
export const editClient = async (id, data, admin) => {
  const client = await Client.findOne({ _id: id }, "-__v");
  if (!client) {
    throw new RouteError(`/clients/${id}`);
  }

  const fields = await validateEditClient(data, admin);

  if (fields.brand?.name) {
    await validateBrandName(fields.brand.name);
  }

  const toReturn = { _id: client._id, brand: client.brand };

  for (const key in fields) {
    if (typeof fields[key] === "object") {
      client[key] = { ...client[key], ...fields[key] };
    } else {
      client[key] = fields[key];
    }
    toReturn[key] = client[key];
  }
  await client.save();

  return toReturn;
};
