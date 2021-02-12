import Product from "../../../_rest/models/Product";
import { isValidObjectId } from "mongoose";
import { ClientError } from "../../../_rest/misc/errors";

export const validateProductID = async (id, client) => {
  if (isValidObjectId(id)) {
    const product = await Product.findOne({ _id: id }, "client price").lean();
    if (product) {
      if (product.client + "" === client) return product.price;
      throw new ClientError(`Product ${id} does not belong to Client`);
    }
  }
  throw new ClientError(`Product ${id} does not exist`);
};
