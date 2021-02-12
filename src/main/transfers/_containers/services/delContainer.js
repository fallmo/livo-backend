import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Container from "../../../../_rest/models/Container";
import { updateTransfers } from "../utils";

export const delContainer = async id => {
  const container = await Container.findOne({ _id: id }, "status");
  if (!container) {
    throw new RouteError(`/transfers/containers/${id}`);
  }

  if (container.status !== "pending") {
    throw new ClientError(
      `Container cannot be discared while status is: ${container.status}`
    );
  }

  container.status = "discarded";
  await container.save();
  await updateTransfers(container._id, container.status);

  return container;
};
