import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { getWarehouses } from "../services/getWarehouses";
import { getWarehouse } from "../services/getWarehouse";
import { addWarehouse } from "../services/addWarehouse";
import { editWarehouse } from "../services/editWarehouse";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getWarehousesController = async (req, res, next) => {
  req.purpose = "Get List of Warehouses";
  try {
    const warehouses = await getWarehouses();
    const resp = new HttpSuccResponse({ warehouses }, req.purpose);
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
export const getWarehouseController = async (req, res, next) => {
  req.purpose = "Get one Warehouse";
  try {
    const warehouse = await getWarehouse({ _id: req.params.id });
    const resp = new HttpSuccResponse({ warehouse }, req.purpose);
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
export const addWarehouseController = async (req, res, next) => {
  req.purpose = "Create a Warehouse";
  try {
    const warehouse = await addWarehouse(req.body);
    const resp = new HttpSuccResponse({ warehouse }, req.purpose);
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
export const editWarehouseController = async (req, res, next) => {
  req.purpose = "Edit a Warehouse";
  const id = req.params.id;
  const body = req.body;
  try {
    const warehouse = await editWarehouse(id, body);
    const resp = new HttpSuccResponse({ warehouse }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (error) {
    next(error);
  }
};
