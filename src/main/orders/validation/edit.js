import { ClientError } from "../../../_rest/misc/errors";
import Joi from "joi";

export const validateEditOrder = async (data, role, status) => {
  const schema = getSchema(role, status);
  return await schema.validateAsync(data);
};

function getSchema(role, status) {
  switch (role) {
    case "client":
      if (status === "pending") {
        return Joi.object({
          status: Joi.string().valid("draft").optional(),
        }).min(1);
      } else if (status !== "draft") {
        throw new ClientError(`You can no longer edit order`);
      }

      return Joi.object({
        desired_date: Joi.string().optional(),
        cost: Joi.number().optional(),
        openable: Joi.boolean().optional(),
        products: Joi.array()
          .items(
            Joi.object({
              product: Joi.string().required(),
              quantity: Joi.number().min(1).required(),
            })
          )
          .min(1)
          .optional(),
        target: Joi.object({
          name: Joi.string().optional(),
          phone: Joi.string().optional(),
          city: Joi.string().optional(),
          zone: Joi.string().optional(),
        }).optional(),
        status: Joi.string().valid("pending").optional(),
      });
    case "warehouse":
      if (status !== "pending") {
        throw new ClientError(
          `You cannot edit order while status is: ${status}`
        );
      }
      return Joi.object({
        deliverer: Joi.string().allow("").optional(),
      });
    case "deliverer":
      const valid = getValid(status);
      return Joi.object({
        status: Joi.string()
          .valid(...valid)
          .optional(),
        desired_date: Joi.string().optional(),
      });
    default:
      throw new Error(`Unexpected role: ${role}`);
  }
}

function getValid(status) {
  switch (status) {
    case "draft":
      throw new ClientError("Order cannot be edited while it's in draft");
    case "pending":
      return ["draft", "in progress"];
    case "in progress":
      return ["pending", "fulfilled", "problem"];
    case "problem":
      return ["pending", "in progress"];
    case "fulfilled":
      throw new ClientError("Order has been fulfilled; cannot be edited.");
    case "awaiting transfer":
      throw new ClientError("Order is awaiting transfer; cannot be edited");
    case "cancelled":
      throw new ClientError("Order has been cancelled; cannot be edited");
    default:
      throw new Error(`Unexpected order status: ${status}`);
  }
}
