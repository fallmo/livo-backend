import Session from "../../../_rest/models/Session";

/**
 *
 * @param {String} id - Session id
 */
export const getSession = async id => {
  return await Session.findById(id, "-__v");
};

/**
 *
 * @param {String} id - Session id
 */
export const endSession = async id => {
  await Session.findOneAndDelete({ _id: id });
};

/**
 * @param {{email: string, ip: string, device: string}} data
 */
export const createSession = async data => {
  return await Session.create(data);
};

/**
 *
 * @param {string} email
 */
export const endAllSessions = async email => {
  const sessions = await Session.find({ email }, "_id");
  for (const session of sessions) {
    await session.remove();
  }
};
