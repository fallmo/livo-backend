import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";

/**
 * Makes sure user is either an admin or an owner of the User account.
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresSelfU = async (req, res, next) => {
  req.purpose = "Prove rights to User account";
  try {
    // if user is admin let him through;
    if (req.user.role === "admin") return next();

    // if user is trying to access his own resource
    if (req.user._id === req.params.id) return next();

    // if nothing could be negotiated
    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
