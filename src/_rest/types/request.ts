import { Request } from "express";
import { Schema } from "mongoose";


export interface xRequest extends Request {
    purpose?: string;
    user?: {
        _id: string;
        role: string;
        email: string;
        client?: Schema.Types.ObjectId;
        warehouse?: Schema.Types.ObjectId;
        deliverer?: Schema.Types.ObjectId; 
    }
}
