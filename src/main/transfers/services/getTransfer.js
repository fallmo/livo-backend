import { RouteError } from "../../../_rest/misc/errors";
import Transfer from "../../../_rest/models/Transfer";

export const getTransfer = async query => {
  const transfer = await Transfer.findOne(query, "-__v");
  if (transfer) return transfer;
  throw new RouteError(`/transfers/${query._id || ":id"}`);
};
