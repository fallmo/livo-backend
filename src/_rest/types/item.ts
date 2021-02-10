import { Document, Schema } from 'mongoose';
import { IDeliverer } from './deliverer';
import { IEvent } from './event';
import { IOrder } from './order';
import { IPickup } from './pickup';
import { IProduct } from './product';
import { ITransfer } from './transfer';
import { IWarehouse } from './warehouse';

export interface IItem extends Document {
    product: Schema.Types.ObjectId | IProduct;
    warehouse: Schema.Types.ObjectId | IWarehouse;
    status: "available" | "undergoing delivery" | "undergoing transfer" | "with deliverer" | "delivered";
    pickup: Schema.Types.ObjectId | IPickup;
    transfer?: Schema.Types.ObjectId | ITransfer;
    deliverer?: Schema.Types.ObjectId | IDeliverer;
    order?: Schema.Types.ObjectId | IOrder;
    history: IEvent[] // virtual
}