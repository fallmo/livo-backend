import { validateProductID } from "../utils";
import { validateTransfer } from "../validation/create";
import Transfer from "../../../_rest/models/Transfer";

export const addTransfer = async (data, client) => {
  const fields = await validateTransfer(data);

  for (const { product, quantity } of fields.products) {
    await validateProductID(client, product, quantity, fields.from_city);
  }

  const transfer = await Transfer.create({ ...fields, client });

  return transfer;
};
