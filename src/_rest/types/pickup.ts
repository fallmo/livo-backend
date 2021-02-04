import { Document, Schema} from 'mongoose'
import { IClient } from './client';
import { IDeliverer } from './deliverer';
import { IEvent } from './event';
import { IItem } from './item';
import { IMessage } from './message';
import { IPayment } from './payment';
import { IProduct } from './product';
import { IWarehouse } from './warehouse';

export type IPickup = free | paid;

interface free extends Document {
    client: Schema.Types.ObjectId | IClient;
    warehouse: Schema.Types.ObjectId | IWarehouse;
    type: "free";
    status: "fulfilled";
    resolved_products: {
        product: Schema.Types.ObjectId | IProduct,
        quantity: number
    }[];
    timestamps: {
        fulfilled: Date;
    };
    history: IEvent[]; // virtual
    items: IItem[]; // virtual
}

interface paid extends Document{
    client: Schema.Types.ObjectId | IClient;
    warehouse: Schema.Types.ObjectId | IWarehouse;
    deliverer?: Schema.Types.ObjectId | IDeliverer;
    type: "paid";
    status: "pending" | "in progress" | "fulfilled" | "cancelled";
    desired_date?: Date;
    products: {
            product: Schema.Types.ObjectId | IProduct,
            quantity: number
        }[];
    target: {
        name: string;
        phone: string;
        city: string;
        zone: string;
    }
    timestamps: {
        requested: Date;
        started?: Date;
        fulfilled?: Date;
        cancelled?: Date;
    };
    payments: IPayment[]; // virtual
    history: IEvent[]; // virtual
    items: IItem[]; // virtual
    messages?: IMessage[] // virtual
}