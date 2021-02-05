import Joi from "joi";

/**
 * @param {any} data
 * @param {boolean} [admin] - Whether user is admin
 */
export const validateEditUser = async (data, admin) => {
  const schema = getSchema(admin);
  return await schema.validateAsync(data);
};

/**
 * @param {boolean} admin - Whether user is admin
 */
function getSchema(admin) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    government: admin
      ? Joi.object({
          id: Joi.string().optional(),
          image: Joi.string().optional(),
        }).optional()
      : Joi.forbidden(),
    active: admin ? Joi.boolean().optional() : Joi.forbidden(),
  }).min(1);
  return schema;
}

// I know i dont have to add .optional()
