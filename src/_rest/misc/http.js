/**
 * HttpFailResponse - Failed to execute purpose of request.
 */
export class HttpFailResponse {
  /**
   *
   * @param {string} purpose - Defines purpose of request
   * @param {Error} error - The error object thrown
   */
  constructor(purpose = "Process Request", error) {
    /**
     * @property {number} status - Http Status Code to Send Back
     */
    console.log(error);

    this.status = 500;
    this.message = `Failed to ${purpose}`;
    this.detail = error.message;
    this.type = "InternalError";

    if (error.name === "ClientError" || error.name === "ValidationError") {
      // if joi error err.details[0].message might be better
      this.status = 400;
      this.message = error.message;
      this.detail = undefined;
      this.type = "ClientError";
    }
    if (error.name === "PermissionError") {
      //@ts-ignore
      this.status = error.code || 403;
      this.message = error.message;
      this.detail = undefined;
      this.type = error.name;
    }

    if (error.name === "RouteError") {
      this.status = 404;
      this.message = "Invalid URL Route";
      this.detail = `Route: ${error.message}`;
      this.type = error.name;
    }

    this.payload = {
      success: false,
      data: {
        message: this.message,
        detail: this.detail,
        type: this.type,
      },
    };
  }
}

/**
 * HttpSuccResponse - Succeeded in executing purpose of request.
 */
export class HttpSuccResponse {
  /**
   *
   * @param {any} data - Data to send to client
   * @param {string} [purpose] - Defines purpose of request
   */
  constructor(data, purpose) {
    this.purpose = purpose; // For logging;
    this.payload = {
      success: true,
      data,
    };
  }
}
