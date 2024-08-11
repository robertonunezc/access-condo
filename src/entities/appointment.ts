import { Entity } from "../repositories/crudInterface";
import { House } from "./house";

interface AppointmentInterface extends Entity {
    personName: string;
    house: House;
    carPlate: string;
    scheduledDateTime: Date;
    status: AppointmentStatus;
    personPhysicalId?: string;
    shareLink?: string;
    inDateTime?: Date;
    outDateTime?: Date;
}

export class Appointment implements AppointmentInterface {
    constructor(
        public house: House,
        public personName: string,
        public carPlate: string,
        public status: AppointmentStatus,
        public scheduledDateTime: Date,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
        public personPhysicalId?: string,
        public shareLink?: string,
        public inDateTime?: Date,
        public outDateTime?: Date,
    ) {}
}

export enum AppointmentStatus {
    CREATED = 'CREATED',
    APPLIED = 'APPLIED',
    DONE = 'DONE'
}