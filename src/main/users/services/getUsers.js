import User from "../../../_rest/models/User";

export const getUsers = async (query = {}) => {
  return await User.find(query, "name email role").lean();
};
