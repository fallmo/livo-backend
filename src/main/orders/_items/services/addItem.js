import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Order from "../../../../_rest/models/Order";
import { validateItemID } from "../utils";
import { validateAddItem } from "../validation/add";

export const addItem = async (id, data, deliverer) => {
  const order = await Order.findOne({ _id: id }, "-__v").populate(
    "items",
    "product"
  );

  if (!order) {
    throw new RouteError(`/orders/${id}/items`);
  }

  if (order.status !== "pending") {
    throw new ClientError(
      `Cannot add items to Order while status is: ${order.status} `
    );
  }

  const fields = await validateAddItem(data);

  const item = await validateItemID(
    fields.item,
    order.products,
    order.items,
    deliverer
  );

  item.order = id;
  item.deliverer = undefined;
  item.status = "undergoing delivery";

  await item.save();
  order.depopulate("items");
  return { ...item.toObject(), order };
};
