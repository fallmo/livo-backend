import { RouteError } from "../../../_rest/misc/errors";
import Pickup from "../../../_rest/models/Pickup";
import { getDateTerm, validateDelivererID } from "../utils";
import { validateEditPickup } from "../validation/edit";

/**
 *
 * @param {string} id - Pickup ID
 * @param {any} data - Data
 * @param {any} user - User
 */
export const editPickup = async (id, data, user) => {
  const pickup = await Pickup.findOne(
    { _id: id },
    "deliverer status timestamps"
  );
  if (!pickup) {
    throw new RouteError(`/pickups/${id}`);
  }
  const fields = await validateEditPickup(data, user.role, pickup.status);

  if (typeof fields.deliverer !== "undefined") {
    if (fields.deliverer) {
      await validateDelivererID(fields.deliverer);
      // if a deliverer was set
      // @ts-ignore
      pickup.deliverer = fields.deliverer;
    } else {
      // if an empty string was set as deliverer;
      // @ts-ignore
      pickup.deliverer = undefined;
    }
  }

  if (fields.status) {
    pickup.deliverer = user.deliverer;
    //@ts-ignore
    pickup.status = fields.status;
    pickup.timestamps[getDateTerm(fields.status)] = new Date();
    if (fields.status === "fulfilled") {
      // create items;
      // deal with pickup fee
    }
  }

  await pickup.save();

  return pickup;
};
