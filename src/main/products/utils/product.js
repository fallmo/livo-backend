import { ClientError } from "../../../_rest/misc/errors";
import Product from "../../../_rest/models/Product";
import { randomString } from "../../../_rest/misc/utils";

/**
 * Make sure client does not upload two products with the same name
 * @param {string} name - Product Name
 * @param {any} client - Client ID
 */
export const validateProductName = async (name, client) => {
  const exists = await Product.exists({ name, client });
  if (!exists) return;
  throw new ClientError(`You already have a product named: ${name}`);
};

/**
 * Tries to generate a random SKU for a product
 * @param {string} name - Product Name
 */
export const generateSku = async name => {
  let tries = 0;
  let uniqueSku = "";
  do {
    // generate a sku;
    const generatedSku = name
      .replace(/[^A-z 0-9]/g, "")
      .split(/\s/)
      .map(string => {
        if (string.length < 4) {
          return string + randomString(4 - string.length);
        } else {
          let str = string.replace(/[aeiou]/gi, "");
          if (str.length < 4) {
            return str + randomString(4 - str.length);
          }
          return str.slice(0, 4);
        }
      })
      .concat([randomString(3)])
      .join("-")
      .toUpperCase();

    // check if it exists
    const exists = await Product.exists({ sku: generatedSku });
    if (!exists) {
      // if unique => set uniqueSku
      uniqueSku = generatedSku;
    }

    // if not then increment tries and keep going
    tries++;
  } while (!uniqueSku && tries < 5);

  // if after so many tries we couldnt come up with unique sku
  if (!uniqueSku) {
    throw new Error("Failed to come up with unique sku after 5 tries.");
  }
  return uniqueSku;
};
