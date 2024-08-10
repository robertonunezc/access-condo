import { House } from "./house";

interface Appointment {
    house: House;
    personPhysicalId: string;
    personName: string;
    carPlate: string;
    status: AppointmentStatus;
    inDateTime?: Date;
    outDateTime?: Date;
}

enum AppointmentStatus {
    CREATED = 'CREATED',
    APPLIED = 'APPLIED',
    DONE = 'DONE'
}