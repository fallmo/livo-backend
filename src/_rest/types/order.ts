import { Document, Schema } from  'mongoose';
import { IClient } from './client';
import { IDeliverer } from './deliverer';
import { IEvent } from './event';
import { IItem } from './item';
import { IMessage } from './message';
import { IPayment } from './payment';
import { IProduct } from './product';


export interface IOrder extends Document {
    client: Schema.Types.ObjectId | IClient;
    deliverer: Schema.Types.ObjectId | IDeliverer;
    status: "draft" | "pending" |  "in progress" | "fulfilled" | "cancelled" | "problem" | "awaiting transfer";
    cost: number;
    desired_date?: Date;
    openable?: boolean;
    products: {
        product: Schema.Types.ObjectId | IProduct,
        quantity: number
    }[];
    target: {
        name: string;
        phone: string;
        city: string;
        zone: string;
    };
    timestamps: {
        drafted: Date;
        requested?: Date;
        started?: Date;
        fulfilled?: Date;
        cancelled?: Date;
    };
    score?: number;
    items: IItem[]; // virtual
    history: IEvent[]; // virtual
    messages: IMessage[]; // virtual
    payments: IPayment[] // virtual
}