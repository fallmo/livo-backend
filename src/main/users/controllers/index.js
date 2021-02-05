import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { getUsers } from "../services/getUsers";
import { getUser } from "../services/getUser";
import { addUser } from "../services/addUser";
import { editUser } from "../services/editUser";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getUsersController = async (req, res, next) => {
  req.purpose = "Get List of Users";
  try {
    const users = await getUsers();
    const resp = new HttpSuccResponse({ users }, req.purpose);
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
export const getUserController = async (req, res, next) => {
  req.purpose = "Get One User";
  try {
    const user = await getUser({ _id: req.params.id });
    const resp = new HttpSuccResponse({ user }, req.purpose);
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
export const addUserController = async (req, res, next) => {
  req.purpose = "Add a User";
  try {
    const user = await addUser(req.body);
    const resp = new HttpSuccResponse({ user }, req.purpose);
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
export const editUserController = async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const admin = req.user.role === "admin";
  try {
    const user = await editUser(id, body, admin);
    const resp = new HttpSuccResponse({ user }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (error) {
    next(error);
  }
};
