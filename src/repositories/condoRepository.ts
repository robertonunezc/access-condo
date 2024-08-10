import { Knex } from "knex";
import { CRUDInterface } from "./crudInterface";
import { Condo } from "../entities/condo";

// Implement the condoRepository.ts file
export class CondoRepository implements CRUDInterface{
    private knex: Knex;

    constructor(knex: Knex) {
      this.knex = knex;
    }

  async findById(id: string): Promise<Condo | null> {
    const condo = await this.knex('condos').where({ id }).first();
    if (!condo) return null;
    return new Condo(condo.name, condo.address, new Date(), new Date());
  }
  async findAll(): Promise<Condo[]> {
    const condos = await this.knex('condos');
    return condos.map((condo) => new Condo(condo.name, condo.address, condo.createdAt, condo.updatedAt));
  }
    async create(condo: Condo): Promise<Condo> {
        const [id] = await this.knex('condos').insert(condo);
        return new Condo(condo.name, condo.address, condo.createdAt, condo.updatedAt);
    }
    async update(condo: Condo): Promise<Condo> {
        await this.knex('condos').where({ id: condo.id }).update(condo);
        return new Condo(condo.name, condo.address, condo.createdAt, new Date());
    }
}
