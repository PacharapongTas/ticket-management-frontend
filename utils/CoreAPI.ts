/* @flow */

import axios, { Method } from "axios";
import UrlUtils from "./UrlUtils";

const publicRuntimeConfig = require("../config/index");

export default class CoreAPI {
  static getErrorMessage(error: any) {
    const { data } = error?.response;
    let errorMessage = data?.detail;
    if (data?.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      errorMessage = `${firstErrorKey} ${data.errors[firstErrorKey].join()}`;
    }

    return errorMessage;
  }

  static isValidStatus(status: number) {
    return status < 400;
  }

  static async fetchJSON({
    url,
    method,
    body,
    query,
    contentType,
  }: {
    url: string;
    method: Method;
    body?: any;
    query?: any;
    contentType?: string;
  }) {
    let finalUrl = "";

    const queryObject = {
      format: "json",
      ...query,
    };

    finalUrl = `${publicRuntimeConfig.API_URL}${url}`;
    finalUrl = UrlUtils.buildAbsolute(finalUrl, queryObject);

    try {
      const result = await axios(finalUrl, {
        method,
        headers: {
          "Content-Type": contentType ? contentType : "application/json",
        },
        data: body,
        validateStatus: (status) => {
          return CoreAPI.isValidStatus(status);
        },
      });

      return result?.data;
    } catch (error: any) {
      const { status } = error?.response;
      throw { message: CoreAPI.getErrorMessage(error), status };
    }
  }
}
