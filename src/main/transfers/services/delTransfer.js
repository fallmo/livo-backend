import { ClientError, RouteError } from "../../../_rest/misc/errors";
import Order from "../../../_rest/models/Order";
import Transfer from "../../../_rest/models/Transfer";
import { freeItems } from "../utils";

export const delTransfer = async id => {
  const transfer = await Transfer.findOne(
    { _id: id },
    "status container order"
  );
  if (!transfer) {
    throw new RouteError(`/transfers/${id}`);
  }

  if (transfer.status !== "pending") {
    throw new ClientError(
      `Transfer cannot be cancelled when status is: ${transfer.status}`
    );
  }

  transfer.status = "cancelled";
  transfer.container = undefined;
  await transfer.save();
  if (transfer.order) {
    await Order.findOneAndUpdate(
      { _id: transfer.order },
      { status: "problem" }
    );
  }
  await freeItems(transfer._id);

  return transfer;
};
