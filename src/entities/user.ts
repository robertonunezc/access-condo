import { Entity } from "../repositories/crudInterface";

export enum UserType {
    ADMIN = "ADMIN",
    USER = "USER",
    HOUSE_OWNER = "CONDO_OWNER",
    CONDO_MANAGER = "CONDO_MANAGER",
}


interface UserInterface extends Entity {
    name: string;
    email: string;
    phone: string;
    type: UserType[];
    username:string;
    password:string;
    token:string;
    createdAt: Date;
}

export class User implements UserInterface {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public type: UserType[],
        public createdAt: Date,
        public updatedAt: Date,
        public username: string,
        public password: string,
        public token: string,
        public id?: string,
      
    ) {}
    static getUserType(type: string): UserType {
        switch (type.toUpperCase()) {
            case "ADMIN":
                return UserType.ADMIN;
            case "USER":
                return UserType.USER;
            case "OWNER":
                return UserType.HOUSE_OWNER;
            case "MANAGER":
                return UserType.CONDO_MANAGER;
            default:
                throw new Error("Invalid user type");
        }
    }
    static convertUsersTypeToString(userTypes: UserType[]): string {
        return userTypes.join("|");
    }
}
