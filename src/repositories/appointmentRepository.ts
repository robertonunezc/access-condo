import { Knex } from "knex";
import { CRUDInterface, } from "./crudInterface";
import { Appointment } from "../entities/appointment";


export class AppointmentRepository implements CRUDInterface {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(data: Appointment): Promise<Appointment> {
      const appointment:Appointment[] =  await this.db('appointments').insert({
        personName: data.personName,
        house_id: data.house.id,
        carPlate: data.carPlate,
        scheduledDate: data.scheduledDateTime,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
        return await this.findById(appointment[0].toString());
    }

    async update(appointmentId:string, data: Partial<Appointment>): Promise<Appointment> {
        const updated = await this.db('appointments').where('id', appointmentId).update(data);
        return this.findById(updated.toString());
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