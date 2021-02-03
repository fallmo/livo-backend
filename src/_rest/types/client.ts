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
    },
    balance: {
        available: number, // virtual based on payments
        pending: number, // virtual based on payments
        payments: IPayment[] // virtual 
    },
    membership: string;
    active: boolean;
    managers: IUser[] // virtual
}