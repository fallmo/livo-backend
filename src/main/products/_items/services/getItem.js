import Item from "../../../../_rest/models/Item";

export const getItem = async query => {
  return await Item.findOne(query, "-__v");
};
