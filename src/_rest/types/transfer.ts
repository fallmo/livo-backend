import { Document, Schema } from  'mongoose';
import { IClient } from './client';
import { IContainer } from './container';
import { IEvent } from './event';
import { IItem } from './item';
import { IOrder } from './order';
import { IPayment } from './payment';
import { IProduct } from './product';
import { IWarehouse } from './warehouse';


export interface ITransfer extends Document {
    client: Schema.Types.ObjectId | IClient;
    from_warehouse: Schema.Types.ObjectId | IWarehouse;
    to_warehouse: Schema.Types.ObjectId | IWarehouse;
    status: "pending" | "in progress" | "fulfilled";
    container: Schema.Types.ObjectId | IContainer;
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
    order?: Schema.Types.ObjectId | IOrder;
    items: IItem[]; // virtual
    history: IEvent[]; // virtual
    payments: IPayment[]; // virtual 
}