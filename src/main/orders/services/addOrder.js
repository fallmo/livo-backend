import { validateProductID } from "../utils";
import { validateOrder } from "../validation/create";
import Order from "../../../_rest/models/Order";

export const addOrder = async (data, client) => {
  const fields = await validateOrder(data);
  const calculatedCost = await fields.products.reduce(async (sum, curr) => {
    const price = await validateProductID(curr.product);
    return sum + price * curr.quantity;
  }, 0);

  const order = await Order.create({
    ...fields,
    client,
    cost: fields.cost || calculatedCost,
  });

  return order;
};
