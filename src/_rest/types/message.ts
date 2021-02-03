import { Schema, Document } from "mongoose";
import { IOrder } from "./order";
import { IPickup } from "./pickup";
import { ITransfer } from "./transfer";
import { IUser } from "./user";


export interface IMessage extends Document {
    text: string;
    user: Schema | IUser; 
    transfer?: Schema | ITransfer; 
    pickup?: Schema | IPickup;
    order?: Schema | IOrder;
    timestamps: {
        created: Date; 
    }
}
