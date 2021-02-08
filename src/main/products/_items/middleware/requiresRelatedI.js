import { Response, NextFunction } from "express";
import Item from "../../../../_rest/models/Item";
import { PermissionError } from "../../../../_rest/misc/errors";

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresRelatedI = async (req, res, next) => {
  req.purpose = "Prove Rights to Item";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "warehouse") {
      const exists = await Item.exists({
        _id: req.params.id,
        warehouse: req.user.warehouse,
      });
      // if item is in the warehouse
      if (exists) return next();
    }

    if (req.user.role === "deliverer") {
      const exists = await Item.exists({
        _id: req.params.id,
        deliverer: req.user.deliverer,
      });
      // if item is with deliverer
      if (exists) return next();
    }

    if (req.user.role === "client") {
      const item = await Item.findOne(
        { _id: req.params.id },
        "product"
      ).populate("product", "client");
      //@ts-ignore
      if (item.product.client + "" === req.user.client + "") return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
