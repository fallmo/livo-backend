import { ClientError, RouteError } from "../../../_rest/misc/errors";
import Transfer from "../../../_rest/models/Transfer";
import { validateContainerID } from "../utils";
import { validateEditTransfer } from "../validation/edit";

export const editTransfer = async (id, data) => {
  const transfer = await Transfer.findOne(
    { _id: id },
    "container from_city to_city"
  ).populate("container", "status");

  if (!transfer) {
    throw new RouteError(`/transfers/${id}`);
  }

  if (transfer.container) {
    // @ts-ignore
    switch (transfer.container.status) {
      case "pending":
        break;
      case "discarded":
        break;
      case "in transit":
        throw new ClientError(
          `Cannot change transfer container while the container is in transit`
        );
      case "arrived":
        throw new ClientError(
          `Cannot change transfer container while the container is in transit`
        );
      default:
        throw new Error(
          //@ts-ignore
          `Unexpected container status: ${transfer.container.status}`
        );
    }
  }

  const fields = await validateEditTransfer(data);

  // doing it this way just incase I add more editable fields and container isnt required
  if (typeof fields.container !== "undefined") {
    if (fields.container) {
      await validateContainerID(
        fields.container,
        transfer.from_city,
        transfer.to_city
      );

      transfer.depopulate("container");
      transfer.container = fields.container;
    } else {
      transfer.container = undefined;
    }
  }

  await transfer.save();

  return transfer;
};
