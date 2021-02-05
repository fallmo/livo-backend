import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Deliverer from "../../../_rest/models/Deliverer";

/**
 * Makes sure user is either self or is related to the account
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresRelatedD = async (req, res, next) => {
  req.purpose = "Prove rights to deliverer account";
  try {
    //if admin
    if (req.user.role === "admin") return next();

    // if deliverer
    if (req.user.role === "deliverer") {
      // if the user owns the account
      if (req.user.deliverer === req.params.id) {
        return next();
      }
    }

    // if warehouse
    if (req.user.role === "warehouse") {
      // if deliverer belongs to this warehouse
      const exists = await Deliverer.exists({
        _id: req.params.id,
        //@ts-ignore
        warehouse: req.user.warehouse,
      });
      if (exists) {
        return next();
      }
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
