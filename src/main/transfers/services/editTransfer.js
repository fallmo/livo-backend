import { ClientError, RouteError } from "../../../_rest/misc/errors";
import Transfer from "../../../_rest/models/Transfer";
import { freeItems, validateContainerID } from "../utils";
import { validateEditTransfer } from "../validation/edit";

export const editTransfer = async (id, data, warehouse) => {
  const transfer = await Transfer.findOne(
    { _id: id },
    "container from_city to_city status"
  );
  if (!transfer) {
    throw new RouteError(`/transfers/${id}`);
  }
  if (transfer.status !== "pending") {
    throw new ClientError(
      `Transfer cannot be edited while status is: ${transfer.status}`
    );
  }

  const fields = await validateEditTransfer(data);
  // doing it this way just incase I add more editable fields and container isnt required
  if (typeof fields.container !== "undefined") {
    if (fields.container) {
      await validateContainerID(
        fields.container,
        transfer.from_city,
        transfer.to_city,
        warehouse
      );

      transfer.container = fields.container;
    } else {
      transfer.container = undefined;
      await freeItems(id);
    }
  }

  await transfer.save();

  return transfer;
};
