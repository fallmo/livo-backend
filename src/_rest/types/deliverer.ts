import { Document, Schema } from "mongoose";
import { IItem } from "./item";
import { IOrder } from "./order";
import { IPayment } from "./payment";
import { IPickup } from "./pickup";
import { IUser } from "./user";
import { IWarehouse } from "./warehouse";

export interface IDeliverer extends Document {
    warehouse: Schema.Types.ObjectId | IWarehouse;
    status: "available" | "unavailable" | "performing delivery" | "performing pickup";
    active: boolean;
    user: Schema.Types.ObjectId | IUser; // virtual (never a object id, its just to get rid of circular warning)
    balance: number; // virtual based on due payments
    score: number; // virtual based on sum of fulfilled orders score
    payments: IPayment[]; // virtual
    items: IItem[]; // virtual
    orders: IOrder[] // virtual
    pickups: IPickup[] // virtual
    options: {
        zones: string[];
        pickups: boolean;
        orders: boolean
    }
}