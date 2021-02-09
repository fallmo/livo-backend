import { Document, Schema } from  'mongoose';
import { IClient } from './client';
import { IContainer } from './container';
import { IEvent } from './event';
import { IItem } from './item';
import { IOrder } from './order';
import { IPayment } from './payment';
import { IProduct } from './product';


export interface ITransfer extends Document {
    from_city: string;
    to_city: string;
    client: Schema.Types.ObjectId | IClient;
    status: "pending" | "in progress" | "fulfilled"; // virtual
    container?: Schema.Types.ObjectId | IContainer;
    products: {
        product: Schema.Types.ObjectId | IProduct,
        quantity: number
    }[];
    timestamps: {
        requested: Date;
        started?: Date; // virtual
        fulfilled?: Date; // virtual
        cancelled?: Date; // virtual
    };
    order?: Schema.Types.ObjectId | IOrder;
    items: IItem[]; // virtual
    history: IEvent[]; // virtual
    payments: IPayment[]; // virtual 
}