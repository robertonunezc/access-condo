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
    const condo:Condo = await this.knex('condos').where({ id }).first();
    if (!condo) return null;
    return {
      ...condo
    };
  }
  async findAll(): Promise<Condo[]> {
    const condos:Condo[] = await this.knex('condos');
    return condos;
  }
    async create(condo: Condo): Promise<Condo> {
        const createdCondoId = await this.knex('condos').insert({
          name: condo.name,
          address: condo.address,
          manager_id: condo.manager.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning('id');
        condo.id = createdCondoId[0].id;
        return {
          ...condo,
        };
    }
    async update(id:string, condo: Condo): Promise<Condo> {
        await this.knex('condos').where({ id: id, updatedAt: new Date() }).update(condo);
        return {
          ...condo,
        };
    }
}
