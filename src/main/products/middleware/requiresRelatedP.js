import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Product from "../../../_rest/models/Product";
import Item from "../../../_rest/models/Item";

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresRelatedP = async (req, res, next) => {
  req.purpose = "Prove Rights to Product";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "client") {
      const exists = await Product.exists({
        _id: req.params.id,
        client: req.user.client,
      });
      if (exists) return next();
    }

    if (req.user.role === "warehouse") {
      // if item in warehouse
      const item = await Item.exists({
        //@ts-ignore
        product: req.params.id,
        warehouse: req.user.warehouse,
      });
      if (item) return next();
    }

    if (req.user.role === "deliverer") {
      // if item with deliverer
      const item = await Item.exists({
        // @ts-ignore
        product: req.params.id,
        deliverer: req.user.deliverer,
      });
      if (item) return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
