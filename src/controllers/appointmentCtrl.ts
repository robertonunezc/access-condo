import { Knex } from 'knex';
import { AppointmentRepository, HouseRepository } from '../repositories';
import { Appointment, AppointmentStatus } from '../entities/appointment';
import { Request } from 'express';
import { RequestDataValidation } from '../errors/exceptions';
import { UploadFile } from '../services/uploadFiles/uploadFile.services';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

export class AppointmentCtrl {
    private appointmentRepository: AppointmentRepository;
    private houseRepository: HouseRepository;
    private uploadFileService: UploadFile;
    constructor(db: Knex, uploadFileService: UploadFile) {
        this.appointmentRepository = new AppointmentRepository(db);
        this.houseRepository = new HouseRepository(db);
        this.uploadFileService = uploadFileService;
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
    async createDummyAppointment(req:Request):Promise<Appointment>{
        const {houseId} = req.body;
        console.log("HouseId", houseId);
        const house = await this.houseRepository.findById(houseId);
        if (!house) {
            throw new RequestDataValidation("House not found");
        }
        const appointment:Appointment = {
            personName: "Tu Nombre",
            house,
            carPlate: "Matricula Carro",
            scheduledDateTime: new Date(),
            status: AppointmentStatus.CREATED,  // default status
            createdAt: new Date(),
            updatedAt: new Date(),

        };
        const createdAppointment = await this.appointmentRepository.create(appointment);
        console.log("Created Appointment", createdAppointment);
        const updatedAppointment = await this.appointmentRepository.update(createdAppointment.id!,{
            shareLink: `${dotenv.config().parsed?.WEB_HOST}/appointment/${createdAppointment.id}`
        });
        console.log("Updated Appointment", updatedAppointment);
        return updatedAppointment;
    }

    async getByDate(date: Date): Promise<Appointment[]> {
        return await this.appointmentRepository.findByDate(date);
    }

    async getByDateAndHouse(date: Date, houseId: string): Promise<Appointment[]> {
        return await this.appointmentRepository.findByDateAndHouseId(date, houseId);
    }

    async getByHouse(houseId: string): Promise<Appointment[]> {
        const appointments = await this.appointmentRepository.findByHouseId(houseId);
        console.log("Appointments", appointments);
        return appointments;
    }

    async update(appointmentId:string, req: Request): Promise<Appointment> {
        // Implement an patch method to update any field of the appointment
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new RequestDataValidation("Appointment not found");
        }
        if(req.file){
            // Implement a method to upload a file
            this.uploadUserCredential(appointmentId, req.file.buffer);
        }
        const appointmentData:Appointment = {...req.body, updatedAt: new Date()};
        return await this.appointmentRepository.update(appointmentId, appointmentData);
    }
    
    async uploadUserCredential(appointmentId: string, stream: Buffer): Promise<string> {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        console.log("Appointment", appointment);
        if (!appointment) {
            throw new RequestDataValidation("Appointment not found");
        }
        const key = randomUUID();
        const path = `appointments/${appointment.house.id}/`;
        const fileName = await this.uploadFileService.upload(path, stream, 'application/jpg', key);
        const data:Partial<Appointment>  = {
            personPhysicalId: `${path}${fileName}.jpg`,
            updatedAt: new Date(),
        };
        await this.appointmentRepository.update(appointmentId,data);
        return fileName;
    }
}