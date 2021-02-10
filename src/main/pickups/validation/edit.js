import Joi from "joi";
import { ClientError } from "../../../_rest/misc/errors";

/**
 * @param {any} data
 * @param {string} role - Whether its a deliverer or a warehouse
 * @param {string} status  - Current Pickup Status
 *
 * @returns {Promise<{status: string, deliverer: string, desired_date: string }>}
 */
export const validateEditPickup = async (data, role, status) => {
  const schema = getSchema(role, status);
  return await schema.validateAsync(data);
};

// once a deliverer takes a pickup, only the warehouse can remove him

function getSchema(role, status) {
  switch (role) {
    case "warehouse":
      if (status !== "pending") {
        throw new ClientError(
          `Pickup with status: ${status} cannot be assigned a deliverer`
        );
      }
      return Joi.object({
        deliverer: Joi.string().allow("").optional(),
        desired_date: Joi.string().optional(),
      }).min(1);
    case "deliverer":
      const valid = getStatus(status);
      return Joi.object({
        status: Joi.string()
          .valid(...valid)
          .optional(),
        desired_date: Joi.string().optional(),
      }).min(1);
    case "client":
      if (status !== "pending") {
        throw new ClientError(`Pickup with status: ${status} cannot be edited`);
      }
      return Joi.object({
        desired_date: Joi.string().optional(),
        products: Joi.array()
          .items(
            Joi.object({
              product: Joi.string().required(),
              quantity: Joi.number().required(),
            })
          )
          .min(1)
          .optional(),
      }).min(1);
    default:
      throw new Error(`Was not expecting role to edit pickup: ${role}`);
  }
}

function getStatus(status) {
  switch (status) {
    case "pending":
      return ["in progress"];
    case "in progress":
      return ["fulfilled", "problem"];
    case "problem":
      return ["pending", "in progress"];
    case "fulfilled":
      throw new ClientError("Cannot edit pickup with status: fulfilled");
    case "cancelled":
      throw new ClientError("Cannot edit pickup with status: cancelled");
    default:
      throw new Error(`Was not expecting pickup status to be: ${status}`);
  }
}
