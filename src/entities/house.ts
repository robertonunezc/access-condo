import { Entity } from "../repositories/crudInterface";
import { Condo } from "./condo";
import { User } from "./user";

export interface IHouse extends Entity {
    owner: User;
    address: string;
    condo: Condo;   
}

export class House implements IHouse {
    constructor(
        public owner: User,
        public address: string,
        public condo: Condo,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
    ) {}
}