import Joi, { func } from "joi";

/**
 * @param {any} data
 * @param {boolean} admin - Whether User is an admin
 */
export const validateDeliverer = async (data, admin) => {
  const schema = getSchema(admin);
  return schema.validateAsync(data);
};

function getSchema(admin) {
  const schema = Joi.object({
    // user
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(), // add regex
    phone: Joi.string().required(),
    government: Joi.object({
      id: Joi.string().required(),
      image: Joi.string().required(),
    }).required(),

    //deliverer
    warehouse: admin ? Joi.string().required() : Joi.forbidden(),
    status: Joi.string().valid("available", "unavailable").optional(),
    options: Joi.object({
      zones: Joi.array().items(Joi.string()).optional(),
      pickups: Joi.boolean().optional(),
      orders: Joi.boolean().optional(),
    }).optional(),
    active: Joi.boolean().optional(),
  });

  return schema;
}
