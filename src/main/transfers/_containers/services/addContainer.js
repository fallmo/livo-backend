import Container from "../../../../_rest/models/Container";
import { validateWarehouseID } from "../utils";
import { validateContainer } from "../validation/create";

export const addContainer = async (data, warehouse) => {
  const fields = await validateContainer(data);

  await validateWarehouseID(fields.to_warehouse, warehouse);

  const container = await Container.create({
    ...fields,
    from_warehouse: warehouse,
  });

  return container;
};
