import Client from "../../../_rest/models/Client";

export const getClients = async () => {
  return await Client.find({}, "-__v -account -active -membership");
};
