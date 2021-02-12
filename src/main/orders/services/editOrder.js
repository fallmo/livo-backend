import { RouteError } from "../../../_rest/misc/errors";
import Order from "../../../_rest/models/Order";
import { validateProductID } from "../utils";
import { validateEditOrder } from "../validation/edit";

export const editOrder = async (id, data, role) => {
  const order = await Order.findOne({ _id: id }, "__v");
  if (!order) {
    throw new RouteError(`/orders/${id}`);
  }
  const fields = await validateEditOrder(data, role, order.status);

  let calculatedCost;
  if (fields.product) {
    calculatedCost = await fields.products.reduce(async (sum, curr) => {
      const price = await validateProductID(curr.product);
      return sum + price * curr.quantity;
    }, 0);
  }

  if (fields.status) {
  }

  for (const key in fields) {
  }
};
