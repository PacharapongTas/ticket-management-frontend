import CoreApi from "./CoreAPI";

/* @flow */

export default class APIClient {
  static getTicketBooking() {
    return CoreApi.fetchJSON({ url: `ticket-booking`, method: "GET" });
  }
}
