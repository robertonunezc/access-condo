import { Entity } from "../repositories/crudInterface";

interface UserInterface extends Entity {
    name: string;
    email: string;
    phone: string;
}

export class User implements UserInterface {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
    ) {}
}
