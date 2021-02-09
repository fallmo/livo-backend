import Joi from "joi";

const schema = Joi.object({
  to_warehouse: Joi.string().required(),
});

export const validateContainer = async data => {
  return await schema.validateAsync(data);
};
