import { Response, NextFunction } from "express";
import { AC_COOKIE, RE_COOKIE } from "../misc/constants";
import { PermissionError } from "../../../_rest/misc/errors";
import { verifyToken, createToken, parseToken } from "../utils/token";
import { decrypt } from "../utils/encryption";
import { getSession } from "../utils/session";

/**
 * Makes sure user is authenticated to proceed
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresAuth = async (req, res, next) => {
  req.purpose = "Prove authenticated";
  const access_token = req.cookies[AC_COOKIE];
  const refresh_token = req.cookies[RE_COOKIE];
  const req_device = req.headers["user-agent"];
  // const req_ip = req.ip; -> no use for ip right now;

  try {
    // No Access Token = no permission
    if (!access_token) {
      throw new PermissionError(
        "you must authenticated to access this resource",
        403
      );
    }

    // parse token
    const { data, error } = verifyToken(access_token);

    // if succesful and token device matches request device =>
    if (data && data.details.device === req_device) {
      req.user = data.user;
      return next();
    }

    // if failed but not expired or no refresh_token =>
    if (error !== "jwt expired" || !refresh_token) {
      throw new PermissionError(error);
    }

    // Retrieve session data from db using refresh_token;
    const session = await getSession(decrypt(refresh_token));

    // if session exists and devices match with request =>
    if (session && session.device === req_device) {
      // get data from expired token =>
      const expired_data = parseToken(access_token);

      // if successful + email and device from token match data from session.
      if (
        expired_data &&
        session.email === expired_data.user.email &&
        session.device === expired_data.details.device
      ) {
        // renew access token with same data and proceed =>
        const newToken = createToken(
          { user: expired_data.user, details: expired_data.details },
          { expiresIn: "15m" }
        );
        req.user = expired_data.user;
        res.set("X-Renewed-Token", "true");
        res.cookie(AC_COOKIE, newToken);
        return next();
      }
    }

    // if nothing could be negotiated =>
    throw new PermissionError("Could not verify auth");
  } catch (err) {
    next(err);
  }
};
