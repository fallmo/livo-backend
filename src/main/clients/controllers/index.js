import { Response, NextFunction } from "express";
import { getClients } from "../services/getClients";
import { getClient } from "../services/getClient";
import { addClient } from "../services/addClient";
import { editClient } from "../services/editClient";
import { HttpSuccResponse } from "../../../_rest/misc/http";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getClientsController = async (req, res, next) => {
  req.purpose = "Get List of Clients";
  try {
    const clients = await getClients();
    const resp = new HttpSuccResponse({ clients }, req.purpose);
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
export const getClientController = async (req, res, next) => {
  req.purpose = "Get a Client";
  try {
    const client = await getClient({ _id: req.params.id });
    const resp = new HttpSuccResponse({ client }, req.purpose);
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
export const addClientController = async (req, res, next) => {
  req.purpose = "Create a Client";
  try {
    const client = await addClient(req.body);
    const resp = new HttpSuccResponse({ client }, req.purpose);
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
export const editClientController = async (req, res, next) => {
  req.purpose = "Edit a Client";
  const id = req.params.id;
  const body = req.body;
  const admin = req.user && req.user.role === "admin";
  try {
    const client = await editClient(id, body, admin);
    const resp = new HttpSuccResponse({ client }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (error) {
    next(error);
  }
};
