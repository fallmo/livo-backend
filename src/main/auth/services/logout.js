import { decrypt } from "../utils/encryption";
import { endSession } from "../utils/session";

/**
 *
 * @param {string} session_id
 */
export const attemptLogout = async session_id => {
  if (!session_id) return;
  return await endSession(decrypt(session_id));
};
