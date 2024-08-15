import { Entity } from "../repositories/crudInterface";

enum UserType {
    ADMIN = "ADMIN",
    USER = "USER",
    CONDO_OWNER = "CONDO_OWNER",
    CONDO_MANAGER = "CONDO_MANAGER",
}
interface UserInterface extends Entity {
    name: string;
    email: string;
    phone: string;
    type: UserType[];
}

export class User implements UserInterface {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public type: UserType[],
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
    ) {}
}
