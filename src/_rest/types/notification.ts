import { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface INotification extends Document {
    users: Schema.Types.ObjectId[] | IUser[];
    text: string;
    link?: string;
    seen: boolean;
    timestamps: {
        created: Date;
        seen?: Date
    }
}