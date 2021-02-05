import jwt from "jsonwebtoken";

/**
 * Verifies JWT - Either returns data from token or error message
 * @param {String} token
 * @param {String} [secret]
 * @returns {{data: any, error: any}}
 */
export const verifyToken = (token, secret) => {
  try {
    const verified = jwt.verify(token, secret ?? process.env.TOKEN_SECRET);
    return { data: verified, error: null };
  } catch (err) {
    return { error: err.message, data: null };
  }
};

/**
 * Signs a JWT
 * @param {string | Object} payload - Ex: {id: '124'}
 * @param {Object} options - Ex: {expiresIn: '2m'}
 * @param {String} [secret] - Ex: secret-code
 * @returns {String}
 */
export const createToken = (payload, options, secret) => {
  return jwt.sign(payload, secret ?? process.env.TOKEN_SECRET, options);
};

/**
 * Parses JWT without caring for expiration.
 * @param {String} token
 * @returns {string | object}
 */
export const parseToken = token => {
  return jwt.verify(token, process.env.TOKEN_SECRET, {
    ignoreExpiration: true,
  });
};
