import { Knex } from 'knex';
import { AppointmentRepository, HouseRepository } from '../repositories';
import { Appointment, AppointmentStatus } from '../entities/appointment';
import { Request } from 'express';
import { RequestDataValidation } from '../errors/exceptions';

export class AppointmentCtrl {
    private appointmentRepository: AppointmentRepository;
    private houseRepository: HouseRepository;

    constructor(db: Knex) {
        this.appointmentRepository = new AppointmentRepository(db);
        this.houseRepository = new HouseRepository(db);
    }

    async getAllAppointments():Promise<Appointment[]> {
        return await this.appointmentRepository.findAll();
    }
   async createAppointment(req: Request):Promise<Appointment>{
        const { personName, houseId,carPlate, scheduledDateTime  } = req.body;
        if (!personName || !houseId || !carPlate || !scheduledDateTime) {
            throw new RequestDataValidation("Data is missing");
        }
        const house = await this.houseRepository.findById(houseId);
        if (!house) {
            throw new RequestDataValidation("House not found");
        }
        const appointment:Appointment = {
            personName,
            house,
            carPlate,
            scheduledDateTime,
            status: AppointmentStatus.CREATED,  // default status
            createdAt: new Date(),
            updatedAt: new Date(),

        };
        return await this.appointmentRepository.create(appointment);
    }

    async getByHouse(houseId: string): Promise<Appointment[]> {
        return await this.appointmentRepository.findByHouseId(houseId);
    }
   
}