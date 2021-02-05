import Joi from "joi";

/**
 * @param {any} data
 * @param {string} current_status - Current Deliverer Status
 * @param {string} role - User role ("warehouse", "deliverer", "admin")
 */
export const validateEditDeliverer = async (data, current_status, role) => {
  const schema = getSchema(current_status, role);
  return schema.validateAsync(data);
};

function getSchema(current_status, role) {
  const delivererSchema = Joi.object({
    status: getStatus(current_status),
  });

  const warehouseSchema = Joi.object({
    status: getStatus(current_status),
    options: Joi.object({
      zones: Joi.array().items(Joi.string()).optional(),
      pickups: Joi.boolean().optional(),
      orders: Joi.boolean().optional(),
    }).optional(),
  });

  const adminSchema = Joi.object({
    warehouse: Joi.string().optional(),
    status: Joi.string().valid("available", "unavailable").optional(),
    options: Joi.object({
      zones: Joi.array().items(Joi.string()).optional(),
      pickups: Joi.boolean().optional(),
      orders: Joi.boolean().optional(),
    }).optional(),
    active: Joi.boolean().optional(),
  });
  switch (role) {
    case "deliverer":
      return delivererSchema;
    case "warehouse":
      return warehouseSchema;
    case "admin":
      return adminSchema;
    default:
      throw new Error(`Was not expecting user role to be: ${role}`);
  }
}

function getStatus(current_status) {
  switch (current_status) {
    case "unavailable":
      return Joi.string().valid("available").optional();
    case "available":
      return Joi.string().valid("unavailable").optional();
    case "performing pickup":
      return Joi.forbidden(); // custom message saying status will return to available once pickup is complete
    case "performin delivery":
      return Joi.forbidden(); // once again, custom message saying status will change automatically
    default:
      throw new Error(
        `Was not expecting deliverer status to be: ${current_status}`
      );
  }
}
