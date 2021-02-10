import Joi from "joi";

const schema = Joi.object({
  item: Joi.string().required(),
});

export const validateAddItem = async data => {
  return await schema.validateAsync(data);
};
