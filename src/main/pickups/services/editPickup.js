import { RouteError } from "../../../_rest/misc/errors";
import Pickup from "../../../_rest/models/Pickup";
import { createItems, validateDelivererID } from "../utils";
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
    "deliverer status timestamps desired_date"
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

  if (fields.desired_date) {
    pickup.desired_date = fields.desired_date;
  }

  if (fields.status) {
    pickup.deliverer = user.deliverer;
    //@ts-ignore
    pickup.status = fields.status;
    if (fields.status === "fulfilled") {
      for (const { product, quantity } of pickup.products) {
        await createItems(quantity, {
          product,
          warehouse: pickup.warehouse,
          pickup: pickup._id,
        });
      }

      // deal with pickup fee
    }
  }

  await pickup.save();

  return pickup;
};
