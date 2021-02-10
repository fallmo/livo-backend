import { Response, NextFunction } from "express";
import { PermissionError } from "../../../../_rest/misc/errors";
import Transfer from "../../../../_rest/models/Transfer";

/**
 * @param {import('../../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresOwnerTCo = async (req, res, next) => {
  req.purpose = "Prove Rights to Transfer Items";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "warehouse") {
      const transfer = await Transfer.findOne(
        { _id: req.params.id },
        "container"
      ).populate("container", "from_warehouse");
      //@ts-ignore
      console.log(transfer.container.from_warehouse, req.user.warehouse);
      //@ts-ignore
      if (transfer.container?.from_warehouse + "" === req.user.warehouse) {
        return next();
      }
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
