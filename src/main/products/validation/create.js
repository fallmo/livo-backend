import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(1).required(),
  image: Joi.string().optional(),
});

export const validateProduct = async data => {
  return await schema.validateAsync(data);
};
