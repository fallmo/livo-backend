import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Container from "../../../../_rest/models/Container";
import { ensureTransfersReady, updateTransfers } from "../utils";
import { validateWarehouseID } from "../utils";
import { validateEditContainer } from "../validation/edit";

export const editContainer = async (id, data, warehouse) => {
  const container = await Container.findOne(
    { _id: id },
    "status timestamps from_warehouse to_warehouse"
  );
  if (!container) {
    throw new RouteError(`/transfers/containers/${id}`);
  }
  switch (warehouse) {
    case container.to_warehouse + "":
      if (container.status !== "in transit") {
        throw new ClientError(`You can't edit Container yet`);
      }
      break;
    case container.from_warehouse + "":
      if (container.status !== "pending") {
        throw new ClientError(`You can no longer edit Container`);
      }
      break;
    default:
      throw new Error(`Unexpected Warehouse trying to edit Container`);
  }

  const fields = await validateEditContainer(data, container.status);

  if (fields.to_warehouse) {
    await validateWarehouseID(fields.to_warehouse, warehouse);
    container.to_warehouse = fields.to_warehouse;
  }

  if (fields.status) {
    if (fields.status === "in transit") {
      await ensureTransfersReady(id);
    }
    container.status = fields.status;
    await updateTransfers(id, fields.status, container.to_warehouse);
  }

  await container.save();

  return container;
};
