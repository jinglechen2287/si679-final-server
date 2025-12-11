// This file should be the same as the client-side types/users.ts
import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    username: string;
    password: string;
    displayName: string;
}

export type Users = User[];