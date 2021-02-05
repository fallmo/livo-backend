import Deliverer from "../../../_rest/models/Deliverer";

export const getDeliverer = async query => {
  return await Deliverer.findOne({ ...query }, "-__v").populate("user", "name");
};
