import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Product from "../../../_rest/models/Product";

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const requiresOwnerP = async (req, res, next) => {
  req.purpose = "Prove rights to Product";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "client") {
      const exists = await Product.exists({
        _id: req.params.id,
        client: req.user.client,
      });
      if (exists) return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
