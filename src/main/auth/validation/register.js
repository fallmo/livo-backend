import Joi from "joi";

const schema = Joi.object({
  // User
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(), // add regex
  phone: Joi.string().required(),
  government: Joi.object({
    id: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
  // Client
  brand_name: Joi.string().required(),
  rib: Joi.string().required(),
  bank_name: Joi.string().required(),
  city: Joi.string().required(),
  zone: Joi.string().required(),
});

export const validateRegister = async data => {
  return await schema.validateAsync(data);
};
