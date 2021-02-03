import { Schema, Document } from "mongoose";
import { IClient } from "./client";
import { IDeliverer } from "./deliverer";
import { IWarehouse } from "./warehouse";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    client?: Schema.Types.ObjectId | IClient;
    warehouse?: Schema.Types.ObjectId | IWarehouse;
    deliverer?: Schema.Types.ObjectId | IDeliverer
    active: boolean;
    government: {
        id: string;
        image: string;
    };
    timestamps: {
        created: Date
    };
}