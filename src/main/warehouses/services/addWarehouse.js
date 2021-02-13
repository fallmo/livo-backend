import Warehouse from "../../../_rest/models/Warehouse";
import { validateWarehouseMain, validateWarehouseName } from "../utils";
import { validateWarehouse } from "../validation/create";

export const addWarehouse = async data => {
  const fields = await validateWarehouse(data);

  await validateWarehouseName(fields.name);
  if (fields.main) {
    await validateWarehouseMain();
  }

  const warehouse = await Warehouse.create(fields);

  return {
    _id: warehouse._id,
    name: warehouse.name,
    main: warehouse.main,
  };
};
