import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";

/**
 * @param {string[]} roles - Array of Roles - can omit "admin"
 * @param {boolean} [strict] - Whether to keep "admin" out
 * @yields {function} - Middleware that makes sure user is of valid role
 */
export const requiresRoles = (roles, strict) => {
  validateRoles(roles);
  /**
   * @param {import("../../../_rest/types/request").xRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  function middleware(req, res, next) {
    req.purpose = "Access Resource";
    try {
      if (!strict) roles.push("admin");
      if (roles.includes(req.user.role)) return next();
      throw new PermissionError("you cannot access this resource", 401);
    } catch (error) {
      next(error);
    }
  }

  return middleware;
};

/**
 * Just makes sure I didn't make a typo in the roles
 * @param {string[]} roles
 */
function validateRoles(roles) {
  for (const role of roles) {
    if (!["client", "deliverer", "warehouse"].includes(role)) {
      throw new Error(`Unexpected role: ${role}`);
    }
  }
}
