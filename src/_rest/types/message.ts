import { Schema, Document } from "mongoose";
import { IOrder } from "./order";
import { IPickup } from "./pickup";
import { ITransfer } from "./transfer";
import { IUser } from "./user";


export interface IMessage extends Document {
    text: string;
    user: Schema.Types.ObjectId | IUser; 
    transfer?: Schema.Types.ObjectId | ITransfer; 
    pickup?: Schema.Types.ObjectId | IPickup;
    order?: Schema.Types.ObjectId | IOrder;
    seen: boolean;
    timestamps: {
        created: Date; 
        seen: Date;
    }
}
