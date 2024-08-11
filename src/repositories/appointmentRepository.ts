import { Knex } from "knex";
import { CRUDInterface, Entity } from "./crudInterface";
import { Appointment } from "../entities/appointment";


export class AppointmentRepository implements CRUDInterface {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(data: Appointment): Promise<Appointment> {
        return await this.db('appointments').insert(data);
    }

    async update(data: Appointment): Promise<Appointment> {
        return await this.db('appointments').where('id', data.id).update(data);
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

}