import Product from "../../../_rest/models/Product";
import { generateSku, validateProductName } from "../utils/product";
import { validateProduct } from "../validation/create";

export const addProduct = async (data, client) => {
  const fields = await validateProduct(data);
  await validateProductName(fields.name, client);
  const sku = await generateSku(fields.name);

  const product = await Product.create({ ...fields, sku, client });

  return product;
};
