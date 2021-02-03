import { Schema, Document } from "mongoose";
import { IItem } from "./item";
import { IOrder } from "./order";
import { IPickup } from "./pickup";
import { ITransfer } from "./transfer";
import { IUser } from "./user";


export interface IEvent extends Document {
    text: string;
    user: Schema | IUser; 
    transfer?: Schema | ITransfer; 
    pickup?: Schema | IPickup;
    order?: Schema | IOrder;
    item?: Schema | IItem;
    timestamps: {
        created: Date; 
    }
}
