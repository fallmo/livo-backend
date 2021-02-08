import { Response, NextFunction } from "express";
import { getItems } from "../services/getItems";
import { HttpSuccResponse } from "../../../../_rest/misc/http";
import { getItem } from "../services/getItem";

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getItemsController = async (req, res, next) => {
  req.purpose = "Get list of Items";
  const query = {};
  if (req.user.role === "warehouse") {
    query["warehouse"] = req.user.warehouse;
  }
  if (req.user.role === "deliverer") {
    query["deliverer"] = req.user.deliverer;
  }
  if (req.user.role === "client") {
    query["client"] = req.user.client;
  }
  try {
    const items = await getItems(query);
    const resp = new HttpSuccResponse({ items }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getProductItemsController = async (req, res, next) => {
  req.purpose = "Get list of Items for Product";
  const query = {};
  if (req.user.role === "warehouse") {
    query["warehouse"] = req.user.warehouse;
  }
  try {
    const items = await getItems({ product: req.params.id, ...query });
    const resp = new HttpSuccResponse({ items }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getItemController = async (req, res, next) => {
  req.purpose = "Get an Item";
  try {
    const item = await getItem({ _id: req.params.id });
    const resp = new HttpSuccResponse({ item }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
