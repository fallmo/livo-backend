import Pickup from "../../../_rest/models/Pickup";
import { RouteError } from "../../../_rest/misc/errors";

/**
 * @param {any} query
 * @param {any} [deliverer] - Deliverer trying to access (to prevent deliverer from going to get items without going through due process...)
 */
export const getPickup = async (query, deliverer) => {
  const pickup = await Pickup.findOne(query, "-__v");
  if (pickup) {
    if (deliverer && pickup.deliverer + "" !== deliverer + "") {
      pickup.client = undefined; // hide client info
      pickup.target.name = undefined; // hide client info
      pickup.target.phone = undefined; // hide client info
    }
    return pickup;
  }
  throw new RouteError(`/pickups/${query._id || ":id"}`);
};
