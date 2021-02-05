import { Document } from 'mongoose'

export  interface ISession extends Document{
    email: string;
    device: string;
    ip: string;
    date_created: Date
    date_accessed: Date
}