import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { getDeliverers } from "../services/getDeliverers";
import { addDeliverer } from "../services/addDeliverer";
import { getDeliverer } from "../services/getDeliverer";
import { editDeliverer } from "../services/editDeliverer";
import { equal } from "joi";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getDeliverersController = async (req, res, next) => {
  req.purpose = "Get List of Deliverers";
  try {
    const query = {};
    if (req.user.role === "warehouse") {
      query["warehouse"] = req.user.warehouse;
    }
    const deliverers = await getDeliverers(query);
    const resp = new HttpSuccResponse({ deliverers }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (error) {
    next(error);
  }
};

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const addDelivererController = async (req, res, next) => {
  req.purpose = "Add a Deliverer";
  const body = req.body;
  const warehouse_id = req.user.warehouse;
  try {
    const deliverer = await addDeliverer(body, warehouse_id);
    const resp = new HttpSuccResponse({ deliverer }, req.purpose);
    return res.status(201).json(resp.payload);
  } catch (error) {
    next(error);
  }
};

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getDelivererController = async (req, res, next) => {
  req.purpose = "Get a Deliverer";
  try {
    const deliverer = await getDeliverer({ _id: req.params.id });
    const resp = new HttpSuccResponse({ deliverer }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (error) {
    next(error);
  }
};

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const editDelivererController = async (req, res, next) => {
  req.purpose = "Edit a Deliverer";
  const id = req.params.id;
  const data = req.body;
  const role = req.user.role;
  try {
    const deliverer = await editDeliverer(id, data, role);
    const resp = new HttpSuccResponse({ deliverer }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (error) {
    next(error);
  }
};
