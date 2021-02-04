import { Document } from "mongoose";
import { IDeliverer } from "./deliverer";
import { IItem } from "./item";
import { IPayment } from "./payment";
import { IPickup } from "./pickup";
import { ITransfer } from "./transfer";
import { IUser } from "./user";

export interface IWarehouse extends Document {
    name: string;
    city: string;
    main: boolean;
    fees: {
        order: number;
        pickup: number;
    }
    pickups: IPickup[] // virtual
    transfers: {
        incoming: ITransfer[] // virtual,
        outgoing: ITransfer[] // virtual
    }
    items: IItem[]; // virtual
    managers: IUser[]; // virtual
    deliverers: IDeliverer[] // virtual
    payments: IPayment[] // virtual
    balance: number; // virtual
}