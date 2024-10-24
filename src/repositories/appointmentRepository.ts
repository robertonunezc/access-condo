import { Knex } from "knex";
import { CRUDInterface, } from "./crudInterface";
import { Appointment } from "../entities/appointment";


export class AppointmentRepository implements CRUDInterface {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(appointment: Appointment): Promise<Appointment> {
      const appointmentCreated =  await this.db('appointments').insert({
        personName: appointment.personName,
        house_id: appointment.house.id,
        carPlate: appointment.carPlate,
        scheduledDate: appointment.scheduledDateTime,
        status: appointment.status,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning("id");
    appointment.id = appointmentCreated[0].id;
        return  appointment;
    }

    async update(appointmentId:string, data: Partial<Appointment>): Promise<Appointment> {
        await this.db('appointments').where('id', appointmentId).update(data);
        return this.findById(appointmentId);
    }

    async delete(id: number): Promise<Appointment> {
        return await this.db('appointments').where('id', id).del();
    }

    async findAll(): Promise<Appointment[]> {
        return await this.db('appointments').select('*');
    }

    async findById(id: string): Promise<Appointment> {
        const appointment = await this.db('appointments')
                            .where('appointments.id', id)
                            .first()
                            
        appointment.house = {
            id: appointment.house_id,
        }
        return appointment;
    }

    async findByHouseId(houseId: string): Promise<Appointment[]> {
        return await this.db('appointments').join('houses','id', houseId).where('house_id', houseId).select('*');
    }
    async findByDate(date: Date): Promise<Appointment[]> {
        return await this.db('appointments').where('scheduledDate', date);
    }
    async findByDateAndHouseId(date: Date, houseId: string): Promise<Appointment[]> {
        const formattedDate = date.toISOString().slice(0, 10);// TO REMOVE TIME FROM DATE
        const query = this.db<Appointment>('appointments').join('houses','houses.id', 'appointments.house_id').where('scheduledDate', formattedDate).andWhere('house_id', houseId).select('*');
        return await query ;
    }
}