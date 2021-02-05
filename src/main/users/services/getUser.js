import { RouteError } from "../../../_rest/misc/errors";
import User from "../../../_rest/models/User";

/**
 *
 * @param {Object} query - Ex: {_id: 'xyz'}
 */
export const getUser = async query => {
  const user = await User.findOne(query, "-__v -password -date_created");
  if (user) return user;
  throw new RouteError(`/users/${query._id || ":id"}`);
};
