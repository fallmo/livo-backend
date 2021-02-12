import Joi from "joi";

const schema = Joi.object({
  from_city: Joi.string().required(),
  to_city: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

export const validateTransfer = async data => {
  return await schema.validateAsync(data);
};
