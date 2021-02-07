import Pickup from "../../../_rest/models/Pickup";

export const getPickups = async (query = {}) => {
  return Pickup.find(
    query,
    "-__v -deliverer -warehouse -target -products"
  ).lean();
};
