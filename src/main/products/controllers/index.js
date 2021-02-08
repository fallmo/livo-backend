import { Response, NextFunction } from "express";
import { HttpSuccResponse } from "../../../_rest/misc/http";
import { addProduct } from "../services/addProduct";
import { editProduct } from "../services/editProduct";
import { getProduct } from "../services/getProduct";
import { getProducts } from "../services/getProducts";

/**
 * @param {import('../../../_rest/types/request').xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const addProductController = async (req, res, next) => {
  req.purpose = "Add a Product";
  const body = req.body;
  const client = req.user.client;
  try {
    const product = await addProduct(body, client);
    const resp = new HttpSuccResponse({ product }, req.purpose);
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
export const editProductController = async (req, res, next) => {
  req.purpose = "Edit a Product";
  const id = req.params.id;
  const body = req.body;
  try {
    const product = await editProduct(id, body);
    const resp = new HttpSuccResponse({ product }, req.purpose);
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
export const getProductController = async (req, res, next) => {
  req.purpose = "Get a Product";
  try {
    const product = await getProduct({ _id: req.params.id });
    const resp = new HttpSuccResponse({ product }, req.purpose);
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
export const getProductsController = async (req, res, next) => {
  req.purpose = "Get Products";
  const query = {};
  if (req.user.role === "warehouse") {
    query["warehouse"] = req.user.warehouse;
  }
  if (req.user.role === "client") {
    query["client"] = req.user.client;
  }
  if (req.user.role === "deliverer") {
    query["deliverer"] = req.user.deliverer;
  }
  try {
    const products = await getProducts(query);
    const resp = new HttpSuccResponse({ products }, req.purpose);
    return res.status(200).json(resp.payload);
  } catch (err) {
    next(err);
  }
};
