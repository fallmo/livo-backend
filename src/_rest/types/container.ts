import { Document } from "mongoose";
import { ITransfer } from "./transfer";
import { IWarehouse } from "./warehouse";

export interface IContainer extends Document {
    warehouse: IWarehouse;
    transfers: ITransfer[]; // virtual;
    status: "pending" | "in transit" | "arrived" | "discarded"
    timestamps: {
        created: Date;
        sent: Date;
        arrived: Date;
        discarded: Date;

    }
}