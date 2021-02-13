import { isValidObjectId } from "mongoose";
import { ClientError } from "../../../../_rest/misc/errors";
import Item from "../../../../_rest/models/Item";

/**
 * @param {*} id - Item ID
 * @param {*} products - Array of Products of order
 * @param {*} items - Array of Items of order
 * @param {*} deliverer - ID of deliverer adding item
 */
export const validateItemID = async (id, products, items, deliverer) => {
  if (!isValidObjectId(id)) {
    throw new ClientError("Item ID is not valid");
  }

  const item = await Item.findOne(
    { _id: id },
    "product status transfer deliverer"
  );
  if (!item) {
    throw new ClientError(`Item ${id} does not exist`);
  }

  if (item.status !== "available" && item.status !== "with deliverer") {
    throw new ClientError(
      `Item cannot be added while status is ${item.status}`
    );
  }

  if (item.deliverer && item.deliverer + "" !== deliverer) {
    throw new ClientError("Item is with another deliverer");
  }

  const product = products.find(
    product => product.product + "" === item.product + ""
  );

  if (!product) {
    throw new ClientError(`Item does not belong in this transfer`);
  }

  const total = items.reduce((acc, curr) => {
    if (curr.product + "" === product.product + "") return acc + 1;
    else return 0;
  }, 0);

  if (total >= product.quantity) {
    throw new ClientError("Quantity satisfied for this product");
  }

  return item;
};
