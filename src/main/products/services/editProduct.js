import Product from "../../../_rest/models/Product";
import { validateEditProduct } from "../validation/edit";

export const editProduct = async (id, data) => {
  const product = await Product.findOne({ _id: id }, "name price image");
  const fields = await validateEditProduct(data);

  for (const key in fields) {
    // no objects
    product[key] = fields[key];
  }
  await product.save();
  return product;
};
