import Item from "../../../../_rest/models/Item";

export const getItems = async (query = {}) => {
  return await Item.find(query).lean();
};
