import { Schema, Document } from "mongoose";
import { IOrder } from "./order";
import { ITransfer } from "./transfer";


export interface IPayment extends Document {
    type: "debit" | "credit";
    amount: number;
    text: string;
    fulfilled: boolean;
    transfer?: Schema.Types.ObjectId | ITransfer; 
    order?: Schema.Types.ObjectId | IOrder;
    timestamps: {
        created: Date;
        fulfilled?: Date; 
    }
}
