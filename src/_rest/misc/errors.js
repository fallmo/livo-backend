import { Response, NextFunction } from "express";
import { HttpFailResponse } from "./http";

/**
 * Client Error:
 * An error caused by client request. (Includes: missing fields, wrong credentials, etc..).
 */
export class ClientError extends Error {
  /**
   * @param {string} message - The Error. (example: "Email field is required.")
   */
  constructor(message = "", ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClientError);
    }

    this.name = "ClientError";
    this.message = message;
    this.date = new Date();
  }
}

/**
 * Permission Error:
 * An error caused by insufficient user priviledges.
 */
export class PermissionError extends Error {
  /**
   * @param {string} message - The Error. (example: "Must be Admin to Delete Product.")
   * @param {number} [code] - Error Code (example: 401 or 403)
   */
  constructor(message = "", code, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError);
    }

    this.name = "PermissionError";
    this.message = message;
    this.code = code;
    this.date = new Date();
  }
}

export class RouteError extends Error {
  /**
   * @param {string} message - The Route. (example: "/:invalid/route")
   */
  constructor(message = "", ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RouteError);
    }

    this.name = "RouteError";
    this.message = message;
    this.date = new Date();
  }
}

/**
 * Middleware to handle any request errors
 * @param {Error} error
 * @param {import("../types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const errorHandler = (error, req, res, next) => {
  const resp = new HttpFailResponse(req.purpose, error);
  return res.status(resp.status).json(resp.payload);
};
