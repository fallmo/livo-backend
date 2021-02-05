import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

/**
 * Return AES Encrypted String
 * @param {String} text
 */
export const encrypt = text => {
  return CryptoJS.AES.encrypt("" + text, process.env.AES_SECRET).toString();
};

/**
 * Return AES Decrypted String
 * @param {String} text
 */
export const decrypt = text => {
  const bytes = CryptoJS.AES.decrypt("" + text, process.env.AES_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Hashes String
 * @param {string} string
 * @returns {Promise<string>}
 */
export const hashString = async string => {
  return await bcrypt.hash(string, 10);
};

/**
 * Compares String and Hash
 * @param {string} string
 * @param {string} hash
 *
 * @returns {Promise<boolean>}
 */
export const compareHash = async (string, hash) => {
  return await bcrypt.compare(string, hash);
};
