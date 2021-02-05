import Joi from "joi";

const schema = Joi.object({
  membership: Joi.string().valid("basic", "premium").required(),
  active: Joi.boolean().optional(),
  brand: Joi.object({
    name: Joi.string().required(),
    logo: Joi.string().optional(),
  }).required(),
  location: Joi.object({
    city: Joi.string().required(),
    zone: Joi.string().required(),
  }).required(),
  account: Joi.object({
    rib: Joi.string().required(),
    bank_name: Joi.string().required(),
  }).required(),
});

export const validateClient = async data => {
  return schema.validateAsync(data);
};
