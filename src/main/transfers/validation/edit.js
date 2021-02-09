import Joi from "joi";

const schema = Joi.object({
  container: Joi.string().allow("").required(),
});

export const validateEditTransfer = async data => {
  return await schema.validateAsync(data);
};
