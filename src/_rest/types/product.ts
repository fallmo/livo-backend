import {Document, Schema} from 'mongoose';
import { IClient } from './client';
import { IEvent } from './event';
import { IItem } from './item';

export interface IProduct extends Document {
    name: string;
    sku: string;
    price: number;
    image: string;
    client: Schema.Types.ObjectId | IClient;
    history: IEvent[]; // virtual
    items: IItem[]; // virtual
}