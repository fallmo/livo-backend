import Joi from "joi";

const schema = Joi.object({
  desired_date: Joi.string().optional(),
  cost: Joi.number().optional(),
  openable: Joi.boolean().optional(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
  target: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    city: Joi.string().required(),
    zone: Joi.string().required(),
  }).required(),
});

export const validateOrder = async data => {
  return schema.validateAsync(data);
};
