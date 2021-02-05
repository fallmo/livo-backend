import { Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { RouteError } from "../misc/errors";

/**
 *
 * @param {import("../types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */

// just loop through keys and check for every one like /(*id)/
export const requiresValidID = (req, res, next) => {
  req.purpose = "Access Resource";
  if (isValidObjectId(req.params.id)) {
    if (req.params.id2) {
      if (isValidObjectId(req.params.id2)) {
        return next();
      }
    } else {
      return next();
    }
  }

  throw new RouteError(req.originalUrl);
};
