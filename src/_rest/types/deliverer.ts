import { Document } from "mongoose";
import { IItem } from "./item";
import { IOrder } from "./order";
import { IPayment } from "./payment";
import { IUser } from "./user";

export interface IDeliverer extends Document {
    warehouse: any;
    status: string;
    balance: number; // virtual based on due payments
    score: number; // virtual based on sum of fulfilled orders score
    user: IUser; // virtual
    payments: IPayment[]; // virtual
    items: IItem[]; // virtual
    orders: IOrder[] // virtual
    options: {
        zones: string[];
        pickups: boolean;
        orders: boolean
    }
}