import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  government: Joi.object({
    id: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
  role: Joi.string()
    .valid("admin", "client", "warehouse", "deliverer")
    .required(),
  active: Joi.boolean().optional(),
  client: Joi.string().when("role", {
    is: "client",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  warehouse: Joi.string().when("role", {
    is: "warehouse",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  deliverer: Joi.string().when("role", {
    is: "deliverer",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
}).oxor("client", "warehouse", "deliverer");

export const validateUser = async data => {
  return await schema.validateAsync(data);
};
