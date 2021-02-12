import { Response, NextFunction } from "express";
import { PermissionError } from "../../../../_rest/misc/errors";
import Container from "../../../../_rest/models/Container";

/**
 * @param {import('../../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresOwnerCo = async (req, res, next) => {
  req.purpose = "Prove Rights to Container";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "warehouse") {
      const exists = await Container.exists({
        _id: req.params.id,
        from_warehouse: req.user.warehouse,
      });

      if (exists) return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
