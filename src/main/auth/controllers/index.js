import { HttpSuccResponse } from "../../../_rest/misc/http";
import { Response, NextFunction } from "express";
import { attemptLogin } from "../services/login";
import { attemptRegister } from "../services/register";
import { attemptLogout } from "../services/logout";
import { AC_COOKIE, RE_COOKIE } from "../misc/constants";

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const registerController = async (req, res, next) => {
  req.purpose = "Register a New User and Client";
  try {
    const user_client = await attemptRegister(req.body);
    const resp = new HttpSuccResponse({ ...user_client }, req.purpose);
    return res.status(201).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const loginController = async (req, res, next) => {
  req.purpose = "Log User In";
  try {
    const details = {
      ip: req.ip,
      device: req.headers["user-agent"],
    };
    const { user, session_id, access_token } = await attemptLogin(
      req.body,
      details
    );
    const resp = new HttpSuccResponse({ user }, req.purpose);
    return res
      .status(200)
      .cookie(AC_COOKIE, access_token)
      .cookie(RE_COOKIE, session_id)
      .json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getStateController = async (req, res, next) => {
  req.purpose = "Get Auth State";
  try {
    const user = { ...req.user };
    const resp = new HttpSuccResponse({ user }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const logoutController = async (req, res, next) => {
  req.purpose = "Log User Out";
  try {
    await attemptLogout(req.cookies[RE_COOKIE]);
    const resp = new HttpSuccResponse({}, req.purpose);
    return res
      .clearCookie(AC_COOKIE)
      .clearCookie(RE_COOKIE)
      .status(202)
      .json(resp.payload);
  } catch (error) {
    next(error);
  }
};
