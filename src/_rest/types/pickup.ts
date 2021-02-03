import {Document, Schema} from 'mongoose'
import { IClient } from './client';
import { IDeliverer } from './deliverer';
import { IEvent } from './event';
import { IItem } from './item';
import { IMessage } from './message';
import { IProduct } from './product';
import { IWarehouse } from './warehouse';

export interface IPickup extends Document {
    client: Schema.Types.ObjectId | IClient;
    warehouse: Schema.Types.ObjectId | IWarehouse;
    deliverer?: Schema.Types.ObjectId | IDeliverer;
    type: "free" | "paid";
    status: string;
    desired_date?: Date;
    products: {
            product: Schema.Types.ObjectId | IProduct,
            quantity: number
        }[];
    timestamps: {
        requested: Date;
        started?: Date;
        fulfilled?: Date;
        cancelled?: Date;
    };
    history: IEvent[]; // virtual
    items: IItem[]; // virtual
    messages?: IMessage[] // virtual
}