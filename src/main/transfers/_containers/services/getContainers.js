import Container from "../../../../_rest/models/Container";

export const getContainers = async (query = {}) => {
  return await Container.find(query, "-__v");
};
