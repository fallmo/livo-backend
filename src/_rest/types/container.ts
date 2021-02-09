import { Document, Schema } from "mongoose";
import { ITransfer } from "./transfer";
import { IWarehouse } from "./warehouse";
import { IItem } from './item';

export interface IContainer extends Document {
    from_warehouse: Schema.Types.ObjectId | IWarehouse;
    to_warehouse: Schema.Types.ObjectId | IWarehouse;
    status: "pending" | "in transit" | "arrived" | "discarded"
    timestamps: {
        created: Date;
        sent?: Date;
        arrived?: Date;
        discarded?: Date;
    }
    transfers: ITransfer[]; // virtual;
    items: IItem[]; // virtual
}