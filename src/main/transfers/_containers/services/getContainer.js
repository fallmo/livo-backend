import { RouteError } from "../../../../_rest/misc/errors";
import Container from "../../../../_rest/models/Container";

export const getContainer = async query => {
  const container = await Container.findOne(query, "-__v");
  if (container) return container;
  throw new RouteError(`/transfers/containers/${query._id || ":id"}`);
};
