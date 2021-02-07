import Joi from "joi";

/**
 * @param {any} data
 * @param {string} type - Whether this is a "free" or "paid" pickup
 */
export const validatePickup = async (data, type) => {
  const schema = getSchema(type);
  return await schema.validateAsync(data);
};

function getSchema(type) {
  switch (type) {
    case "paid":
      return Joi.object({
        desired_date: Joi.string().optional(),
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

    case "free":
      return Joi.object({
        products: Joi.array()
          .items(
            Joi.object({
              product: Joi.string().required(),
              quantity: Joi.number().min(1).required(),
            })
          )
          .min(1)
          .required(),
        client: Joi.string().required(),
      });
    default:
      throw new Error(`Was not expecting pickup type to be: ${type}`);
  }
}
