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
export const getTransfersItemsController = async (req, res, next) => {
  req.purpose = "Get list of Items involved in transfers";
  const query = { transfer: { $exists: true } };
  try {
    const items = await getItems(query);
    const resp = new HttpSuccResponse({ items }, req.purpose);
    res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
/*
    need to limit it to the warehouses related
 */

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getTransferItemsController = async (req, res, next) => {
  req.purpose = "Get list of Items of a Transfer";
  const transfer = req.params.id;
  try {
    const items = await getItems({ transfer });
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
export const getTransferItemController = async (req, res, next) => {
  req.purpose = "Get a Transfer Item";
  const transfer = req.params.id;
  const _id = req.params.id2;
  try {
    const item = await getItem({ transfer, _id });
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
export const addTransferItemController = async (req, res, next) => {
  req.purpose = "Add Item to Transfer";
  const id = req.params.id;
  const body = req.body;
  try {
    const item = await addItem(id, body);
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
export const remTransferItemController = async (req, res, next) => {
  req.purpose = "Remove Item from Transfer";
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
