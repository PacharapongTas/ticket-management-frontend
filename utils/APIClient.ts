import CoreApi from "./CoreAPI";
import { ICREATETICKETBOOKING, ICREATETICKETTYPE } from "./Constants"

/* @flow */

export default class APIClient {
  static getTicketBooking(query: any) {
    return CoreApi.fetchJSON({ url: `ticket-booking`, method: "GET", query });
  }

  static deleteTicketBooking(id: string) {
    return CoreApi.fetchJSON({ url: `ticket-booking/${id}`, method: "DELETE", });
  }

  static getTicketType() {
    return CoreApi.fetchJSON({ url: `ticket-type/`, method: "GET", });
  }

  static getMaximunTicketType(id: string) {
    return CoreApi.fetchJSON({ url: `ticket-type/maximum-ticket-type/${id}`, method: "GET", });
  }
  
  static createTicketBooking(body: ICREATETICKETBOOKING) {
    return CoreApi.fetchJSON({ url: "ticket-booking", method: "POST", body })
  }

  static getTicketTypeQuery(query: any) {
    return CoreApi.fetchJSON({ url: `ticket-type/filter-ticket-type`, method: "GET", query });
  }

  static createTicketType(body: ICREATETICKETTYPE) {
    return CoreApi.fetchJSON({ url: "ticket-type", method: "POST", body })
  }

  static getTicketTypeById(id: string) {
    return CoreApi.fetchJSON({ url: `ticket-type/${id}`, method: "GET", });
  }

  static updateTicketType(id: string, body: any) {
    return CoreApi.fetchJSON({ url: `ticket-type/${id}`, method: "PUT", body });
  }

  static deleteTicketType(id: string) {
    return CoreApi.fetchJSON({ url: `ticket-type/${id}`, method: "DELETE", });
  }
}
