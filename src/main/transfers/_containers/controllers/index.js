import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../../_rest/misc/http";
import { getContainer } from "../services/getContainer";
import { addContainer } from "../services/addContainer";
import { getContainers } from "../services/getContainers";
import { editContainer } from "../services/editContainer";

/**
 * @param {import("../../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getContainersController = async (req, res, next) => {
  req.purpose = "Get list of Containers";
  const query = {};

  if (req.user.role === "warehouse") {
    query["$or"] = [
      { from_warehouse: req.user.warehouse },
      { to_warehouse: req.user.warehouse },
    ];
  }

  try {
    const containers = await getContainers(query);
    const resp = new HttpSuccResponse({ containers }, req.purpose);
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
export const getContainerController = async (req, res, next) => {
  req.purpose = "Get a Container";
  try {
    const container = await getContainer({ _id: req.params.id });
    const resp = new HttpSuccResponse({ container }, req.purpose);
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
export const addContainerController = async (req, res, next) => {
  req.purpose = "Create a Container";
  const body = req.body;
  const warehouse = req.user.warehouse;
  try {
    const container = await addContainer(body, warehouse);
    const resp = new HttpSuccResponse({ container }, req.purpose);
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
export const editContainerController = async (req, res, next) => {
  req.purpose = "";
  const id = req.params.id;
  const body = req.body;
  const warehouse = req.user.warehouse;
  try {
    const container = await editContainer(id, body, warehouse);
    const resp = new HttpSuccResponse({ container }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
