import { Knex } from "knex";
import { CRUDInterface, Entity } from "./crudInterface";
import { House } from "../entities/house";


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
        const [id] = await this.db('houses').insert({
            address: house.address,
            condo_id: house.condo.id,
            owner_id: house.owner.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return house;
    }

    async update(house: House): Promise<House> {
        await this.db('houses').where({ id: house.id }).update(house);
        return house;
    }

    async delete(id: string): Promise<House> {
        return await this.db('houses').where({ id }).del();
    }
}