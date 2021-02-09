import { validateOrderID, validateProductID } from "../utils";
import { validateTransfer } from "../validation/create";
import Transfer from "../../../_rest/models/Transfer";

export const addTransfer = async (data, client) => {
  const fields = await validateTransfer(data);

  for (const { product } of fields.products) {
    // check for quantity>
    await validateProductID(product, client);
  }

  if (fields.order) {
    await validateOrderID(fields.order, client);
  }

  const transfer = await Transfer.create({ ...fields, client });

  return transfer;
};
