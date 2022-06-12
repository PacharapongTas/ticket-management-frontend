export interface IBREADCRUMBS {
    name: string
    text: string
    href: string
}

export interface ITICKETFORM {
    name: string
    email: string
    ticket_type: [] | null
}

export const DEFAULT_TIME_ZONE = 'Asia/Bangkok';

export const DEFAULT_FORMAT_DATE = 'dddd, MMMM D YYYY';