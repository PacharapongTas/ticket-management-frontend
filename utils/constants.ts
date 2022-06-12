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

export const PREVENT_DELETE_VALUE = ['A','B','C','D']
export interface ICREATETICKETBOOKING {
    ticket_type_id: string;
    user_email: string;
    quantity: number;
}

export interface ICREATETICKETTYPE {
    ticket_type: string;
    price: number;
    daily_quota: number;
    minimum: number;
}
