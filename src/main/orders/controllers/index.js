import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { addOrder } from "../services/addOrder";
import { editOrder } from "../services/editOrder";
import { getOrder } from "../services/getOrder";
import { getOrders } from "../services/getOrders";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getOrderController = async (req, res, next) => {
  req.purpose = "Get an Order";
  try {
    const order = await getOrder({ _id: req.params.id }, req.user.deliverer);
    const resp = new HttpSuccResponse({ order }, req.purpose);
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
export const getOrdersController = async (req, res, next) => {
  req.purpose = "Get list of Orders";
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
    const orders = await getOrders(query);
    const resp = new HttpSuccResponse({ orders }, req.purpose);
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
export const addOrderController = async (req, res, next) => {
  req.purpose = "Create an Order";
  const { body } = req;
  const { client } = req.user;
  try {
    const order = await addOrder(body, client);
    const resp = new HttpSuccResponse({ order }, req.purpose);
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
export const editOrderController = async (req, res, next) => {
  req.purpose = "Edit an Order";
  const { id } = req.params;
  const { body, user } = req;
  try {
    const order = await editOrder(id, body, user);
    const resp = new HttpSuccResponse({ order }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
