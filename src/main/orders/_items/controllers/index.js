import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../../_rest/misc/http";
import { addItem } from "../services/addItem";
import { getItem } from "../services/getItem";
import { getItems } from "../services/getItems";
import { remItem } from "../services/remItem";

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getOrdersItemsController = async (req, res, next) => {
  req.purpose = "Get list of Items involved in orders";
  const query = { order: { $exists: true } };
  try {
    const items = await getItems(query);
    const resp = new HttpSuccResponse({ items }, req.purpose);
    res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getOrderItemsController = async (req, res, next) => {
  req.purpose = "Get list of Items of an Order";
  const order = req.params.id;
  try {
    const items = await getItems({ order });
    const resp = new HttpSuccResponse({ items }, req.purpose);
    res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getOrderItemController = async (req, res, next) => {
  req.purpose = "Get an Order Item";
  const order = req.params.id;
  const _id = req.params.id2;
  try {
    const item = await getItem({ order, _id });
    const resp = new HttpSuccResponse({ item }, req.purpose);
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
export const addOrderItemController = async (req, res, next) => {
  req.purpose = "Add Item to Order";

  const {
    body,
    user: { deliverer },
    params: { id },
  } = req;

  try {
    const item = await addItem(id, body, deliverer);
    const resp = new HttpSuccResponse({ item }, req.purpose);
    return res.status(201).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const remOrderItemController = async (req, res, next) => {
  req.purpose = "Remove Item from Order";
  try {
    const id = req.params.id;
    const item_id = req.params.id2;
    const item = await remItem(id, item_id);
    const resp = new HttpSuccResponse({ item }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
