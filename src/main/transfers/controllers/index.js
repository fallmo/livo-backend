import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { addTransfer } from "../services/addTransfer";
import { delTransfer } from "../services/delTransfer";
import { editTransfer } from "../services/editTransfer";
import { getTransfer } from "../services/getTransfer";
import { getTransfers } from "../services/getTransfers";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getTransferController = async (req, res, next) => {
  req.purpose = "Get a Transfer";
  try {
    const transfer = await getTransfer({ _id: req.params.id });
    const resp = new HttpSuccResponse({ transfer }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getTransfersController = async (req, res, next) => {
  req.purpose = "Get List of Transfers";
  const query = {};
  if (req.user.role === "client") {
    query["client"] = req.user.client;
  }

  if (req.user.role === "warehouse") {
    query["warehouse"] = req.user.warehouse;
  }
  try {
    const transfers = await getTransfers(query);
    const resp = new HttpSuccResponse({ transfers }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const addTransferController = async (req, res, next) => {
  req.purpose = "Add a Transfer";
  const body = req.body;
  const client = req.user.client;
  try {
    const transfer = await addTransfer(body, client);
    const resp = new HttpSuccResponse({ transfer }, req.purpose);
    return res.status(201).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const editTransferController = async (req, res, next) => {
  req.purpose = "Get a Transfer";
  const id = req.params.id;
  const body = req.body;
  const warehouse = req.user.warehouse;
  try {
    const transfer = await editTransfer(id, body, warehouse);
    const resp = new HttpSuccResponse({ transfer }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const delTransferController = async (req, res, next) => {
  req.purpose = "Cancel a Transfer";
  try {
    const transfer = await delTransfer(req.params.id);
    const resp = new HttpSuccResponse({ transfer }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
