import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Item from "../../../../_rest/models/Item";

export const getItem = async ({ transfer, ...rest }) => {
  const item = await Item.findOne(rest, "-__v");
  if (item) {
    if (item.transfer && item.transfer + "" === transfer + "") return item;
    throw new ClientError(`Item does not belong to this transfer`);
  }
  throw new RouteError(
    `/transfers/${transfer || ":transfer"}/items/${rest._id || ":id"}`
  );
};
