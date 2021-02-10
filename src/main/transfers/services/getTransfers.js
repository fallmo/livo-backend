import Transfer from "../../../_rest/models/Transfer";
import Warehouse from "../../../_rest/models/Warehouse";

export const getTransfers = async (query = {}) => {
  if (query.warehouse) {
    console.log(query.warehouse);
    const warehouse = await Warehouse.findOne({ _id: query.warehouse }, "city");
    const open_transfers = await Transfer.find(
      { "container": { "$exists": false }, "from_city": warehouse.city },
      "-__v"
    );
    const active_transfers = await Transfer.aggregate()
      .lookup({
        from: "containers",
        localField: "container",
        foreignField: "_id",
        as: "container",
      })
      .unwind({ path: "$container" })
      .match({
        $or: [
          { "container.from_warehouse": warehouse._id },
          { "container.to_warehouse": warehouse._id },
        ],
      })
      .project({ container: -1 });
    ////// find more efficient way later
    return [...open_transfers, ...active_transfers];
  }

  return await Transfer.find({ ...query, warehouse: undefined }, "-__v");
};
