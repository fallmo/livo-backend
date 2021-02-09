import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { addPickup } from "../services/addPickup";
import { canPickup } from "../services/canPickup";
import { editPickup } from "../services/editPickup";
import { getPickup } from "../services/getPickup";
import { getPickups } from "../services/getPickups";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getPickupsController = async (req, res, next) => {
  req.purpose = "Get List of Pickups";
  const query = {};
  const user = req.user;
  if (user.role === "warehouse") {
    query["warehouse"] = user.warehouse;
  }

  if (user.role === "client") {
    query["client"] = user.client;
  }
  if (user.role === "deliverer") {
    query["type"] = "paid"; // no need to see free pickups
    query["$or"] = [
      { deliverer: { $exists: false } }, // pickups with no deliverer
      { deliverer: user.deliverer }, // pickups where he's the deliverer
    ];
  }
  try {
    const pickups = await getPickups(query);
    const resp = new HttpSuccResponse({ pickups }, req.purpose);
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
export const getPickupController = async (req, res, next) => {
  req.purpose = "Get a Pickup";
  try {
    const pickup = await getPickup({ _id: req.params.id }, req.user.deliverer);
    const resp = new HttpSuccResponse({ pickup }, req.purpose);
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
export const addPickupController = async (req, res, next) => {
  req.purpose = "Add a Pickup";
  const body = req.body;
  const user = req.user;
  try {
    const pickup = await addPickup(body, user);
    const resp = new HttpSuccResponse({ pickup }, req.purpose);
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
export const editPickupController = async (req, res, next) => {
  req.purpose = "Edit a Pickup";
  const id = req.params.id;
  const body = req.body;
  const user = req.user;
  try {
    const pickup = await editPickup(id, body, user);
    const resp = new HttpSuccResponse({ pickup }, req.purpose);
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
export const canPickupController = async (req, res, next) => {
  req.purpose = "Cancel a Pickup";
  try {
    const pickup = await canPickup(req.params.id);
    const resp = new HttpSuccResponse({ pickup }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
