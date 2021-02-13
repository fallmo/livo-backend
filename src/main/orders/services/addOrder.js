import Order from "../../../_rest/models/Order";
import { lightValidateProductID, validateProductID } from "../utils";
import { validateOrder } from "../validation/create";

export const addOrder = async (data, client) => {
  const fields = await validateOrder(data);
  let calculatedCost = 0;

  for (const { product, quantity } of fields.products) {
    const price = await lightValidateProductID(product, client);
    calculatedCost += price * quantity;
  }

  const cost = fields.cost || calculatedCost;

  const order = await Order.create({ ...fields, cost, client });

  return order;
};
