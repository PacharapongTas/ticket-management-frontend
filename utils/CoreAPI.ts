/* @flow */

import axios, { Method } from "axios";
import UrlUtils from "./UrlUtils";
import Utils from "./Utils";

const publicRuntimeConfig = require("../config/index");

export default class CoreAPI {
    static getCookie(name: string) {
        if (!document.cookie) {
            return "";
        }

        const xsrfCookies = document.cookie
            .split(";")
            .map((c) => c.trim())
            .filter((c) => c.startsWith(`${name}=`));

        if (xsrfCookies.length === 0) {
            return "";
        }

        return decodeURIComponent(xsrfCookies[0].split("=")[1]);
    }

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
        url: string,
        method: Method,
        body?: any,
        query?: any,
        contentType?: string
    }) {
        const isBrowser = Utils.isBrowser();
        let finalUrl = "";

        const queryObject = {
            format: "json",
            ...query,
        };

        finalUrl = `${publicRuntimeConfig.API_URL}${url}`;
        finalUrl = UrlUtils.buildAbsolute(finalUrl, queryObject);
        console.log('finalUrl :>> ', finalUrl);
        try {
            const result = await axios(finalUrl, {
                method,
                headers: {
                    "Content-Type": contentType ? contentType : "application/x-www-form-urlencoded",
                },
                data: body,
                validateStatus: (status) => {
                    return CoreAPI.isValidStatus(status);
                },
            });
            console.log('result :>> ', result);

            return result?.data;

        } catch (error: any) {
            console.log('error :>> ', error);
            const { status } = error?.response;
            throw { message: CoreAPI.getErrorMessage(error), status };
        }
    }
}
