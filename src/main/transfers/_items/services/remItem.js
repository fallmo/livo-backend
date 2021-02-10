import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Item from "../../../../_rest/models/Item";

export const remItem = async (id, item_id) => {
  const item = await Item.findOne({ _id: item_id }, "transfer status").populate(
    "transfer",
    "status"
  );

  if (!item) {
    throw new RouteError(`/transfers/${id}/items/${item_id}`);
  }

  // @ts-ignore
  if (!item.transfer || item.transfer._id + "" !== id) {
    throw new ClientError(`Item does not belong to this transfer`);
  }

  // must have a container before item is added.

  // @ts-ignore
  if (item.transfer.status !== "pending") {
    throw new ClientError(
      // @ts-ignore
      `Transfer cannot have items removed from it while status is: ${item.transfer.status}`
    );
  }

  item.transfer = undefined;
  item.status = "available";

  await item.save();

  return item;
};
