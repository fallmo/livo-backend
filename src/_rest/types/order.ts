import { Document, Schema } from  'mongoose';
import { IClient } from './client';
import { IDeliverer } from './deliverer';
import { IEvent } from './event';
import { IItem } from './item';
import { IMessage } from './message';
import { IProduct } from './product';


export interface IOrder extends Document {
    client: Schema.Types.ObjectId | IClient;
    deliverer: Schema.Types.ObjectId | IDeliverer;
    status: string;
    cost: number;
    comment: string;
    desired_date?: Date;
    openable?: boolean;
    products: {
        product: Schema.Types.ObjectId | IProduct,
        quantity: number
    }[];
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
}