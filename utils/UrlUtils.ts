/* @flow */

import qs from "qs";

export default class UrlUtils {
    static buildRelative(url: string, query: any) {
        const cleanUrl = url.replace(/^\/+/g, "");
        return `/${cleanUrl}?${qs.stringify(query, { indices: false })}`;
    }

    static buildAbsolute(url: string, query: any) {
        const cleanUrl = url.replace(/^\/+/g, "");
        return `${cleanUrl}?${qs.stringify(query, { indices: false })}`;
    }
}
