import { User } from "./user";

export interface House {
    owner: User;
    address: string;
    condo: Condo;   
}