import Order from "../../../_rest/models/Order";
import Warehouse from "../../../_rest/models/Warehouse";
import Deliverer from "../../../_rest/models/Deliverer";

export const getOrders = async (query = {}) => {
  if (query.warehouse) {
    const warehouse = await Warehouse.findOne(
      { _id: query.warehouse },
      "city"
    ).lean();
    return Order.find({ "target.city": warehouse.city }, "-__v -target").lean();
  }
  if (query.deliverer) {
    const deliverer = await Deliverer.findOne(
      { _id: query.deliverer },
      "warehouse"
    ).populate("warehouse", "city");

    return Order.find(
      { "target.city": deliverer.warehouse.city },
      "-__v -target"
    ).lean();
  }
  return Order.find(query, "__v").lean();
};
