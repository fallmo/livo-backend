import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";

/**
 * @param {string[]} roles - Array of Roles - can omit "admin"
 * @yields {function} - Middleware that makes sure user is of valid role
 */
export const requiresRoles = roles => {
  /**
   * @param {import("../../../_rest/types/request").xRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  function middleware(req, res, next) {
    req.purpose = "Access Resource";
    try {
      if ([...roles, "admin"].includes(req.user.role)) return next();
      throw new PermissionError("you cannot access this resource", 401);
    } catch (error) {
      next(error);
    }
  }

  return middleware;
};
