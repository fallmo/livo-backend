import { Document } from "mongoose";
import { IPayment } from "./payment";
import { IUser } from "./user";

export interface IClient extends Document {
    brand: {
        name: string,
        logo: string
    },
    location: {
        city: string,
        zone: string,
    },
    account: {
        rib: string,
        bank_name: string,
        automatic_cashout?: number,
    },
    balance: {
        available: number, // virtual based on payments
        pending: number, // virtual based on payments
    },
    membership: string;
    active: boolean;
    payments: IPayment[] // virtual 
    managers: IUser[] // virtual
}