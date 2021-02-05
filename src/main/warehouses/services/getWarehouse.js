import Warehouse from "../../../_rest/models/Warehouse";

import { RouteError } from "../../../_rest/misc/errors";

export const getWarehouse = async query => {
  const warehouse = await Warehouse.findOne(query, "-__v");

  if (warehouse) return warehouse;
  throw new RouteError(`/warehouses/${query._id || ":id"}`);
};
