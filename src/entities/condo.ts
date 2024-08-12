import { Entity } from "../repositories/crudInterface";
import { User } from "./user";

interface CondoInterface extends Entity {
    name: string;
    address: string;
    manager: User;
}

export class Condo implements CondoInterface {
    constructor(
        public name: string,
        public address: string,
        public manager: User,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
    ) {}
}