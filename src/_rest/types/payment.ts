import { Schema, Document } from "mongoose";
import { IClient } from "./client";
import { IDeliverer } from "./deliverer";
import { IOrder } from "./order";
import { IPickup } from "./pickup";
import { ITransfer } from "./transfer";
import { IWarehouse } from "./warehouse";


export interface IPayment extends Document {
    type: "debit" | "credit";
    amount: number;
    description: string;
    fulfilled: boolean;
    client?: Schema.Types.ObjectId | IClient;
    warehouse?: Schema.Types.ObjectId | IWarehouse;
    deliverer?: Schema.Types.ObjectId | IDeliverer;
    order?: Schema.Types.ObjectId | IOrder;
    transfer?: Schema.Types.ObjectId | ITransfer; 
    pickup?: Schema.Types.ObjectId | IPickup;
    timestamps: {
        created: Date;
        fulfilled?: Date; 
    }
}
