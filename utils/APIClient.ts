import CoreApi from "./CoreAPI";

/* @flow */

export default class APIClient {
  static getTicketBooking(query: any) {
    return CoreApi.fetchJSON({ url: `ticket-booking`, method: "GET", query });
  }

  static deleteTicketBooking(id: string) {
    return CoreApi.fetchJSON({ url: `ticket-booking/${id}`, method: "DELETE", });
  }
}
