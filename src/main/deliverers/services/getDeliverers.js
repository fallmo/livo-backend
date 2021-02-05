import Deliverer from "../../../_rest/models/Deliverer";

/**
 * @param {Object} query
 */
export const getDeliverers = async (query = {}) => {
  return await Deliverer.find(query, "-__v -options -active");
};
