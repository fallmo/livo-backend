import Joi from "joi";
import { ClientError } from "../../../../_rest/misc/errors";

export const validateEditContainer = async (data, status) => {
  const schema = getSchema(status);
  return schema.validateAsync(data);
};

function getSchema(status) {
  const valid = getValid(status);
  return Joi.object({
    status: Joi.string()
      .valid(...valid)
      .optional(),
    to_warehouse:
      status === "pending" ? Joi.string().optional() : Joi.forbidden(),
  }).min(1);
}

function getValid(status) {
  switch (status) {
    case "pending":
      return ["in transit"];
    case "in transit":
      return ["arrived"];
    case "arrived":
      throw new ClientError("Cannot edit Container that has arrived");
    case "discarded":
      throw new ClientError("Cannot edit Container that has been discarded");
    default:
      throw new Error(`Unexpected Container status: ${status}`);
  }
}
