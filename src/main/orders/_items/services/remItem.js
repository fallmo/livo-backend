import { ClientError, RouteError } from "../../../../_rest/misc/errors";
import Item from "../../../../_rest/models/Item";
import Order from "../../../../_rest/models/Order";

export const remItem = async (order_id, item_id) => {
  const item = await Item.findOne({ _id: item_id }, "-__v").populate(
    "order",
    "status deliverer"
  );

  if (!item) {
    throw new RouteError(`/orders/${order_id}/items/${item_id}`);
  }

  // @ts-ignore
  if (!item.order || item.order?._id + "" !== order_id) {
    throw new ClientError("Item does not belong to this Order");
  }

  // @ts-ignore
  if (item.order.status !== "pending") {
    throw new ClientError(
      // @ts-ignore
      `Order cannot have items removed while status is: ${item.order.status}`
    );
  }

  item.order = undefined;
  item.status = "with deliverer";
  // @ts-ignore
  item.deliverer = item.order?.deliverer;

  await item.save();

  return item;
};
