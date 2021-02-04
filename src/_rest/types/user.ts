import { Schema, Document } from "mongoose";
import { IClient } from "./client";
import { IDeliverer } from "./deliverer";
import { INotification } from "./notification";
import { IWarehouse } from "./warehouse";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "admin" | "client" | "deliverer" | "warehouse";
    client?: Schema.Types.ObjectId | IClient;
    warehouse?: Schema.Types.ObjectId | IWarehouse;
    deliverer?: Schema.Types.ObjectId | IDeliverer
    active: boolean;
    notifications?: INotification[]; // virtual
    oneSignal?: {
        push_token: string;
        push_id: string
    }
    government: {
        id: string;
        image: string;
    };
    timestamps: {
        created: Date
    };
}