import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";

/**
 * Makes sure user is either admin or responsible for this warehouse
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresOwnerW = async (req, res, next) => {
  req.purpose = "Prove Rights to Warehouse";
  try {
    // if admin let him through;
    if (req.user.role === "admin") return next();

    if (req.user.warehouse === req.params.id) {
      // ObjectID /= string?
      return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
