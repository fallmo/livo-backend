import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const validateLogin = async data => {
  return await schema.validateAsync(data);
};
