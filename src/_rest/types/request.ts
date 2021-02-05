import { Request } from "express";
import { Schema } from "mongoose";


export interface xRequest extends Request {
    purpose?: string;
    user?: {
        _id: string;
        role: string;
        email: string;
        client?: Schema.Types.ObjectId | string;
        warehouse?: Schema.Types.ObjectId | string;
        deliverer?: Schema.Types.ObjectId | string; 
    }
}
