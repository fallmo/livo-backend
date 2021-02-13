import Deliverer from "../../../_rest/models/Deliverer";
import Order from "../../../_rest/models/Order";
import Warehouse from "../../../_rest/models/Warehouse";

export const getOrders = async (query = {}) => {
  const projections = "-__v -target.name -target.phone -client -products";
  if (query.warehouse) {
    const warehouse = await Warehouse.findOne(
      { _id: query.warehouse },
      "city"
    ).lean();

    const deliverers = (
      await Deliverer.find({ warehouse: query.warehouse }, "_id").lean()
    ).map(del => del._id);

    return Order.find(
      {
        $or: [
          { deliverer: { $exists: false }, "target.city": warehouse?.city },
          { deliverer: { $in: deliverers } },
        ],
      },
      projections
    );
  }

  if (query.deliverer) {
    const deliverer = await Deliverer.findOne(
      { _id: query.deliverer },
      "warehouse"
    ).lean();

    const warehouse = await Warehouse.findOne(
      { _id: deliverer?.warehouse },
      "city"
    ).lean();

    return Order.find(
      {
        $or: [
          { deliverer: query.deliverer },
          { deliverer: { $exists: false }, "target.city": warehouse?.city },
        ],
      },
      projections
    );
  }

  return Order.find(query, projections);
};
