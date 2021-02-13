import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
  city: Joi.string().required(),
  main: Joi.boolean().optional(),
  active: Joi.boolean().optional(),
  fees: Joi.object({
    pickup: Joi.number().optional(),
    order: Joi.number().optional(),
  }).optional(),
  options: Joi.object({
    pickups: Joi.boolean().optional(),
    transfer_in: Joi.boolean().optional(),
    transfer_out: Joi.boolean().optional(),
  }).optional(),
});

export const validateWarehouse = async data => {
  return schema.validateAsync(data);
};
