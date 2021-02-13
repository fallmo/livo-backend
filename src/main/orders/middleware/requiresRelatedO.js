import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Deliverer from "../../../_rest/models/Deliverer";
import Order from "../../../_rest/models/Order";
import Warehouse from "../../../_rest/models/Warehouse";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresRelatedO = async (req, res, next) => {
  req.purpose = "Prove rights to Order";
  try {
    if (req.user.role === "admin") return next();

    if (req.user.role === "client") {
      const exists = await Order.exists({
        _id: req.params.id,
        client: req.user.client,
      });
      if (exists) return next();
    }

    if (req.user.role === "warehouse") {
      const warehouse = await Warehouse.findOne(
        { _id: req.user.warehouse },
        "city"
      ).lean();

      const deliverers = (
        await Deliverer.find({ warehouse: warehouse._id }, "_id").lean()
      ).map(del => del._id);

      const exists = await Order.exists({
        _id: req.params.id,
        $or: [
          { deliverer: { $exists: false }, "target.city": warehouse.city },
          { deliverer: { $in: deliverers } },
        ],
      });
      if (exists) return next();
    }

    if (req.user.role === "deliverer") {
      const deliverer = await Deliverer.findOne(
        { _id: req.user.deliverer },
        "warehouse"
      ).lean();

      const warehouse = await Warehouse.findOne(
        { _id: deliverer?.warehouse },
        "city"
      ).lean();

      const exists = await Order.exists({
        _id: req.params.id,
        $or: [
          { deliverer: deliverer?._id },
          { deliverer: { $exists: false }, "target.city": warehouse.city },
        ],
      });
      if (exists) return next();
    }
    throw new PermissionError("You cannot access this resource");
  } catch (err) {
    next(err);
  }
};
