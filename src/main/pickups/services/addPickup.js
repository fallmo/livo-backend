import Pickup from "../../../_rest/models/Pickup";
import {
  createItems,
  getMainWarehouse,
  validateClientID,
  validateProductID,
} from "../utils";
import { validatePickup } from "../validation/create";

export const addPickup = async (data, user) => {
  const type = user.client ? "paid" : "free";

  const status = user.client ? "pending" : "fulfilled";
  const timestamps = user.client ? undefined : { fulfilled: new Date() };

  const fields = await validatePickup(data, type);

  const client = user.client || (await validateClientID(fields.client)); // either take the client creating the pickup or take the client the warehouse has sent;
  const warehouse = user.warehouse || (await getMainWarehouse()); // only main warehouse can create pickups;

  for (const { product } of fields.products) {
    await validateProductID(product, client);
  }

  const pickup = await Pickup.create({
    type,
    client,
    warehouse,
    status,
    timestamps,
    ...fields,
  });

  if (type === "free") {
    for (const { product, quantity } of pickup.products) {
      await createItems(quantity, {
        product,
        warehouse: pickup.warehouse,
        pickup: pickup._id,
      });
    }
  }

  return pickup;
};
