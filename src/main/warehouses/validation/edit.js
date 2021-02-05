import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().optional(),
  main: Joi.boolean().optional(),
  active: Joi.boolean().optional(),
  fees: Joi.object({
    pickup: Joi.number().optional(),
    order: Joi.number().optional(),
  }).optional(),
}).min(1);

export const validateEditWarehouse = data => {
  return schema.validateAsync(data);
};
