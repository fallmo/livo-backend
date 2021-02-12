import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Transfer from "../../../../_rest/models/Transfer";
import { validateItemID } from "../utils";
import { validateAddItem } from "../validation/add";

/**
 * @param {*} id - Transfer ID
 * @param {*} data - Req Body
 * @param {*} warehouse - The warehouse adding an item
 */
export const addItem = async (id, data, warehouse) => {
  const transfer = await Transfer.findOne(
    { _id: id },
    "container products items status"
  ).populate("items", "product");

  if (!transfer) {
    throw new RouteError(`/transfers/${id}/items`);
  }

  if (!transfer.container) {
    throw new ClientError("Transfer must have a container before adding Items");
  }

  if (transfer.status !== "pending") {
    throw new ClientError(
      `Transfer cannot have items added to it while status is: ${transfer.status}`
    );
  }

  const fields = await validateAddItem(data);
  const item = await validateItemID(
    fields.item,
    transfer.products,
    transfer.items,
    warehouse
  );

  item.transfer = id;
  item.status = "undergoing transfer";

  await item.save();
  transfer.depopulate("items");
  return { ...item.toObject(), transfer };
};
