import { Entity } from "../repositories/crudInterface";

interface CondoInterface extends Entity {
    name: string;
    address: string;
}

export class Condo implements CondoInterface {
    constructor(
        public name: string,
        public address: string,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
    ) {}
}