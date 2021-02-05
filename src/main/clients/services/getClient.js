import { RouteError } from "../../../_rest/misc/errors";
import Client from "../../../_rest/models/Client";

/**
 * @param {Object} query
 */
export const getClient = async query => {
  const client = await Client.findOne(
    query,
    "-__v -account.rib -account.bank_name"
  );
  if (client) return client;
  throw new RouteError(`/clients/${query._id || ":id"}`);
};
