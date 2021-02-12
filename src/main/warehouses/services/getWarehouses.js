import Warehouse from "../../../_rest/models/Warehouse";

export const getWarehouses = async (query = {}) => {
  return await Warehouse.find(query, "-__v -balance -main -fees -active");
};
