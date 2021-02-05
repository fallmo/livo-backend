import User from "../../../_rest/models/User";
import { ClientError } from "../../../_rest/misc/errors";
import { compareHash, encrypt } from "../utils/encryption";
import { createSession } from "../utils/session";
import { validateLogin } from "../validation/login";
import { createToken } from "../utils/token";

/**
 * @param {any} data
 * @param {{ip: string, device: string}} details
 *
 * @returns {Promise<{access_token: any, session_id: any, user: any}>}
 */
export const attemptLogin = async (data, details) => {
  const fields = await validateLogin(data);

  const user = await User.findOne(
    { email: fields.email },
    "-__v -phone -date_created -government_id"
  ).lean();

  if (!user) {
    throw new ClientError("email is not registered");
  }

  if (!(await compareHash(fields.password, user.password))) {
    throw new ClientError("email and password do not match");
  }

  if (!user.active) {
    throw new ClientError("account has not been activated");
  }

  const session = await createSession({ email: fields.email, ...details });

  const token_payload = {
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      client: user.client,
      warehouse: user.warehouse,
      deliverer: user.deliverer,
    },
    details,
  };

  const access_token = createToken(token_payload, { expiresIn: "15m" });
  const session_id = encrypt(session._id);
  const uzer = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { session_id, access_token, user: uzer };
};
