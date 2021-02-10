import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Transfer from "../../../_rest/models/Transfer";
import Warehouse from "../../../_rest/models/Warehouse";

// optimize later

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresRelatedT = async (req, res, next) => {
  req.purpose = "Prove Rights to Transfer";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "client") {
      const exists = await Transfer.exists({
        _id: req.params.id,
        client: req.user.client,
      });
      if (exists) return next();
    }

    if (req.user.role === "warehouse") {
      const transfer = await Transfer.findOne(
        { _id: req.params.id },
        "from_city container"
      ).populate("container", "from_warehouse to_warehouse");

      // @ts-ignore
      if (transfer.container?.to_warehouse + "" === req.user.warehouse) {
        // if this is receiving warehouse
        return next();
      }

      // @ts-ignore
      if (transfer.container?.from_warehouse + "" === req.user.warehouse) {
        // if this is sender warehouse
        return next();
      }

      if (!transfer.container) {
        const warehouse = await Warehouse.findOne(
          { _id: req.user.warehouse },
          "city"
        ).lean();

        // warehouse needs to send transfer
        if (transfer.from_city === warehouse.city) return next();
      }
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
