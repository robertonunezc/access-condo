import { Knex } from "knex";
import { CRUDInterface } from "./crudInterface";
import { House } from "../entities/house";
import { Appointment } from "../entities/appointment";


export class HouseRepository implements CRUDInterface {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async findById(id: string): Promise<House | null> {
        const house = await this.db('houses').where({ id }).first();
        if (!house) return null;
        return house;
    }

    async findAll(): Promise<House[]> {
        const houses = await this.db('houses');
        return houses;
    }

    async create(house: House): Promise<House> {
         await this.db('houses').insert({
            address: house.address,
            condo_id: house.condo.id,
            owner_id: house.owner.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return house;
    }

    async update(id:string, house: House): Promise<House> {
        await this.db('houses').where({ id: id }).update(house);
        return house;
    }

    async delete(id: string): Promise<House> {
        return await this.db('houses').where({ id }).del();
    }

    async getLastAppointments(id: string): Promise<Appointment[]> {
        return await this.db('appointments').where({ house_id: id }).orderBy('createdAt', 'desc').limit(5);
    }

    async findByUserId(id: string): Promise<House[]> {
        return await this.db('houses').where({ owner_id: id });
    }
}