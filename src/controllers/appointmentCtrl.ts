import { Knex } from "knex";
import { AppointmentRepository, HouseRepository } from "../repositories";
import { Appointment, AppointmentStatus } from "../entities/appointment";
import { Request } from "express";
import { RequestDataValidation } from "../errors/exceptions";
import { UploadFile } from "../services/uploadFiles/uploadFile.services";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import {config} from "../infra/config";
export class AppointmentCtrl {
  private appointmentRepository: AppointmentRepository;
  private houseRepository: HouseRepository;
  private uploadFileService: UploadFile;
  constructor(db: Knex, uploadFileService: UploadFile) {
    this.appointmentRepository = new AppointmentRepository(db);
    this.houseRepository = new HouseRepository(db);
    this.uploadFileService = uploadFileService;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentRepository.findAll();
  }

  async getAppointmentById(appointmentId: string): Promise<Appointment> {
    return await this.appointmentRepository.findById(appointmentId);
  }


  async createAppointment(req: Request): Promise<Appointment> {
    const { personName, houseId, carPlate, scheduledDateTime } = req.body;
    if (!personName || !houseId || !carPlate || !scheduledDateTime) {
      throw new RequestDataValidation("Data is missing");
    }

    const scheduledDateTimeFormated = DateTime.fromISO(scheduledDateTime, {
      zone: "America/Mexico_City",
    });
    const now = DateTime.now().setZone("America/Mexico_City");
    if (scheduledDateTimeFormated < now) {
      throw new RequestDataValidation("Scheduled date is in the past");
    }
    const house = await this.houseRepository.findById(houseId);
    if (!house) {
      throw new RequestDataValidation("House not found");
    }

    const appointment: Appointment = {
      personName,
      house,
      carPlate,
      scheduledDateTime:scheduledDateTimeFormated.toJSDate(),
      status: AppointmentStatus.CREATED, // default status
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.appointmentRepository.create(appointment);
  }

  async createDummyAppointment(req: Request): Promise<Appointment> {
    const { houseId } = req.body;
    console.log("HouseId", houseId);
    const house = await this.houseRepository.findById(houseId);
    if (!house) {
      throw new RequestDataValidation("House not found");
    }
    const appointment: Appointment = {
      personName: "Tu Nombre",
      house,
      carPlate: "Matricula Carro",
      scheduledDateTime: new Date(),
      status: AppointmentStatus.CREATED, // default status
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdAppointment = await this.appointmentRepository.create(
      appointment
    );
    console.log("Created Appointment", createdAppointment.id);
    const updatedAppointment = await this.appointmentRepository.update(
      createdAppointment.id!,
      {
        shareLink: `${config.webHost}/appointment/${
          createdAppointment.id
        }`,
      }
    );
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
    const appointments = await this.appointmentRepository.findByHouseId(
      houseId
    );
    console.log("Appointments", appointments);
    return appointments;
  }

  async update(appointmentId: string, req: Request): Promise<Appointment> {
    // Implement an patch method to update any field of the appointment
    const appointment = await this.appointmentRepository.findById(
      appointmentId
    );
    if (!appointment) {
      throw new RequestDataValidation("Appointment not found");
    }
    const appointmentData: Appointment = { ...req.body, updatedAt: new Date() };

    if (req.file) {
      // Implement a method to upload a file
      const filePath = await this.uploadUserCredential(
        appointmentId,
        req.file.buffer
      );
      appointmentData.personPhysicalId = filePath;
    }
    return await this.appointmentRepository.update(
      appointmentId,
      appointmentData
    );
  }

  async uploadUserCredential(
    appointmentId: string,
    stream: Buffer
  ): Promise<string> {
    const appointment = await this.appointmentRepository.findById(
      appointmentId
    );
    console.log("Appointment", appointment);
    if (!appointment) {
      throw new RequestDataValidation("Appointment not found");
    }
    const key = randomUUID();
    const path = `appointments/${appointment.house.id}/`;
    const fileName = await this.uploadFileService.upload(
      path,
      stream,
      "application/jpg",
      key
    );
    return `${path}${fileName}.jpg`;
  }

  async confirm(
    appointmentId: string
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(
      appointmentId
    );
    if (!appointment) {
      throw new RequestDataValidation("Appointment not found");
    }
    if (appointment.status === AppointmentStatus.DONE) {
      throw new RequestDataValidation("Appointment already checked");
    }
    await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.DONE,
    });
    const updatedAppointment = await this.appointmentRepository.findById(
      appointmentId
    );
    return updatedAppointment;
  }
}
