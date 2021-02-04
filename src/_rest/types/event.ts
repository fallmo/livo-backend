import { Schema, Document } from "mongoose";
import { IItem } from "./item";
import { IOrder } from "./order";
import { IPickup } from "./pickup";
import { IProduct } from "./product";
import { ITransfer } from "./transfer";
import { IUser } from "./user";


export interface IEvent extends Document {
    description: string;
    user: Schema.Types.ObjectId | IUser; 
    transfer?: Schema.Types.ObjectId | ITransfer; 
    pickup?: Schema.Types.ObjectId | IPickup;
    order?: Schema.Types.ObjectId | IOrder;
    item?: Schema.Types.ObjectId | IItem;
    product?: Schema.Types.ObjectId | IProduct;
    timestamps: {
        created: Date; 
    }
}
