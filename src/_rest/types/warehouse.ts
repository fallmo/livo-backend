import { Document } from "mongoose";
import { IDeliverer } from "./deliverer";
import { IItem } from "./item";
import { IPayment } from "./payment";
import { IUser } from "./user";

export interface IWarehouse extends Document {
    name: string;
    city: string;
    main: boolean;
    balance: number; // virtual
    payments: IPayment[] // virtual
    items: IItem[]; // virtual
    managers: IUser[]; // virtual
    deliverers: IDeliverer // virtual
}