import { isValidObjectId } from "mongoose";
import { ClientError } from "../../../../_rest/misc/errors";
import Item from "../../../../_rest/models/Item";

/**
 * @param {*} id  - ID of Item being added
 * @param {*} products - Array of Products of transfer
 * @param {*} items - Array of already added Items of transfer;
 * @param {*} warehouse - The warehouse adding items to Array
 * @returns {Promise<import("../../../../_rest/types/item").IItem>}
 */
export const validateItemID = async (id, products, items, warehouse) => {
  if (!isValidObjectId(id)) {
    throw new ClientError("Item ID provided is not valid");
  }
  const item = await Item.findOne(
    { _id: id },
    "product status transfer warehouse"
  );
  if (!item) {
    throw new ClientError(`Item ${id} does not exist`);
  }
  if (item.warehouse + "" !== warehouse) {
    throw new ClientError(`Item ${id} belongs to another warehouse`);
  }

  if (item.status !== "available") {
    throw new ClientError(
      `Item cannot be added to transfer while status is: ${item.status}`
    );
  }
  // below should never happen vv
  if (item.transfer) {
    throw new ClientError(`Item already belongs to a transfer`);
  }
  // above should never happen ^^

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

// .some vs .find?
