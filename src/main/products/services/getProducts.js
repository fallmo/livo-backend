import Item from "../../../_rest/models/Item";
import Product from "../../../_rest/models/Product";

export const getProducts = async (query = {}) => {
  let products = await Product.find(
    { ...query, warehouse: undefined, deliverer: undefined },
    "-__v -price -client -sku"
  );

  if (query.warehouse) {
    products = (
      await Promise.all(
        products.map(async product => {
          const exists = await Item.exists({
            product: product._id,
            warehouse: query.warehouse,
          });
          if (exists) return product;
          else return undefined;
        })
      )
    ).filter(p => p);
  }

  if (query.deliverer) {
    products = (
      await Promise.all(
        products.map(async product => {
          const exists = await Item.exists({
            product: product._id,
            deliverer: query.deliverer,
          });
          if (exists) return product;
          else return undefined;
        })
      )
    ).filter(p => p);
  }
  return products;
};
