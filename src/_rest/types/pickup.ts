import { Document, Schema} from 'mongoose'
import { IClient } from './client';
import { IDeliverer } from './deliverer';
import { IEvent } from './event';
import { IItem } from './item';
import { IMessage } from './message';
import { IPayment } from './payment';
import { IProduct } from './product';
import { IWarehouse } from './warehouse';



export interface IPickup extends Document {
    client: Schema.Types.ObjectId | IClient;
    warehouse: Schema.Types.ObjectId | IWarehouse;
    deliverer?: Schema.Types.ObjectId | IDeliverer;
    type: "free" | "paid",
    status: "pending" | "in progress" | "fulfilled" | "cancelled" | "problem";
    products: {
        product: Schema.Types.ObjectId | IProduct,
        quantity: number
    }[];
    target?: {
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
    history: IEvent[]; // virtual
    items: IItem[]; // virtual
    payments?: IPayment[]; // virtual
    messages?: IMessage[] // virtual

}

// interface free extends Document {
//     client: Schema.Types.ObjectId | IClient;
//     warehouse: Schema.Types.ObjectId | IWarehouse;
//     type: "free";
//     status: "fulfilled";
//     products: {
//         product: Schema.Types.ObjectId | IProduct,
//         quantity: number
//     }[];
//     timestamps: {
//         fulfilled: Date;
//     };
//     history: IEvent[]; // virtual
//     items: IItem[]; // virtual
// }

// interface paid extends Document{
//     client: Schema.Types.ObjectId | IClient;
//     warehouse: Schema.Types.ObjectId | IWarehouse;
//     deliverer?: Schema.Types.ObjectId | IDeliverer;
//     type: "paid";
//     status: "pending" | "in progress" | "fulfilled" | "cancelled" | "problem";
//     desired_date?: Date;
//     products: {
//             product: Schema.Types.ObjectId | IProduct,
//             quantity: number
//         }[];
//     target: {
//         name: string;
//         phone: string;
//         city: string;
//         zone: string;
//     }
//     timestamps: {
//         requested: Date;
//         started?: Date;
//         fulfilled?: Date;
//         cancelled?: Date;
//     };
//     payments: IPayment[]; // virtual
//     history: IEvent[]; // virtual
//     items: IItem[]; // virtual
//     messages?: IMessage[] // virtual
// }