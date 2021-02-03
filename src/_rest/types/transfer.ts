import { Document, Schema } from  'mongoose';
import { IClient } from './client';
import { IEvent } from './event';
import { IItem } from './item';
import { IProduct } from './product';
import { IWarehouse } from './warehouse';


export interface ITransfer extends Document {
    client: Schema.Types.ObjectId | IClient;
    from_warehouse: Schema.Types.ObjectId | IWarehouse;
    to_warehouse: Schema.Types.ObjectId | IWarehouse;
    status: string;
    products: {
        product: Schema.Types.ObjectId | IProduct,
        quantity: number
    }[];
    timestamps: {
        requested?: Date;
        started?: Date;
        fulfilled?: Date;
        cancelled?: Date;
    };
    items: IItem[]; // virtual
    history: IEvent[]; // virtual
}