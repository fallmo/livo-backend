import Joi from "joi";

const schema = Joi.object({
  price: Joi.number().min(1).optional(),
  image: Joi.string().optional(),
}).min(1);

export const validateEditProduct = async data => {
  return await schema.validateAsync(data);
};
