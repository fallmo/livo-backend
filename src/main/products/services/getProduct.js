import Product from "../../../_rest/models/Product";

export const getProduct = async query => {
  return await Product.findOne(query, "-__v");
};
