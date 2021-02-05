import Joi from "joi";

/**
 * @param {any} data
 * @param {boolean} [admin] - Whether user is admin
 */
export const validateEditClient = async (data, admin) => {
  const schema = getSchema(admin);
  return schema.validateAsync(data);
};

function getSchema(admin) {
  const schema = Joi.object({
    brand: Joi.object({
      name: Joi.string().optional(),
      logo: Joi.string().optional(),
    }).optional(),
    location: Joi.object({
      city: Joi.string().optional(),
      zone: Joi.string().optional(),
    }).optional(),
    account: admin
      ? Joi.object({
          rib: Joi.string().optional(),
          bank_name: Joi.string().optional(),
        }).optional()
      : Joi.forbidden(),
    membership: admin
      ? Joi.string().valid("basic", "premium").optional()
      : Joi.forbidden(),
    active: admin ? Joi.boolean().optional() : Joi.forbidden(),
  }).min(1);
  return schema;
}
