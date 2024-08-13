import { Knex } from "knex";
import { CRUDInterface, Entity } from "./crudInterface";
import { Appointment } from "../entities/appointment";


export class AppointmentRepository implements CRUDInterface {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(data: Appointment): Promise<Appointment> {
       const appointment = await this.db('appointments').insert({
        personName: data.personName,
        house_id: data.house.id,
        carPlate: data.carPlate,
        scheduledDate: data.scheduledDateTime,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date()
    });
        return data
    }

    async update(appointmentId:string, data: Appointment): Promise<Appointment> {
        return await this.db('appointments').where('id', appointmentId).update(data);
    }

    async delete(id: number): Promise<Appointment> {
        return await this.db('appointments').where('id', id).del();
    }

    async findAll(): Promise<Appointment[]> {
        return await this.db('appointments').select('*');
    }

    async findById(id: string): Promise<Appointment> {
        return await this.db('appointments').where('id', id).first();
    }

    async findByHouseId(houseId: string): Promise<Appointment[]> {
        return await this.db('appointments').where('house_id', houseId);
    }

}