import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";

/**
 * Makes sure user is either an admin or an owner of the client.

 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresOwnerC = async (req, res, next) => {
  req.purpose = "Prove rights to Client";
  try {
    // if user is admin let him through;
    if (req.user.role === "admin") return next();

    // if user is owner of this Client account in question =>
    if (req.user.client + "" === req.params.id) {
      return next();
    }

    // if nothing could be negotiated
    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
