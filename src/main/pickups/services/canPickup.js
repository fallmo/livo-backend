import { ClientError, RouteError } from "../../../_rest/misc/errors";
import Pickup from "../../../_rest/models/Pickup";
import { getDateTerm } from "../utils";

export const canPickup = async id => {
  const pickup = await Pickup.findOne({ _id: id }, "status dates");
  if (!pickup) {
    throw new RouteError(`/pickups/${id}`);
  }

  if (pickup.status !== "pending") {
    throw new ClientError(
      `Pickup with status: ${pickup.status} cannot be cancelled`
    );
  }

  pickup.status = "cancelled";
  pickup.timestamps[getDateTerm("cancelled")] = new Date();
  pickup.deliverer = undefined;

  await pickup.save();

  return pickup;
};
