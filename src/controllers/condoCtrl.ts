import { Knex } from "knex";
import { CondoRepository } from "../repositories/condoRepository";
import { RequestDataValidation } from "../errors/exceptions";
import { Request } from "express";
import { Condo } from "../entities/condo";

export class CondoCtrl {
    private condoRepository: CondoRepository;

    constructor(knex: Knex) {
        this.condoRepository = new CondoRepository(knex);
    }

    async getAllCondos() {
        return await this.condoRepository.findAll();
    }

    async createCondo(req: Request): Promise<Condo> {
        console.log("[POST] /condo controller", req.body);
        const { name, address } = req.body;
        if (!name || !address) {
            throw new RequestDataValidation("Data is missing");
        }

        const condo = {
            name,
            address,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await this.condoRepository.create(condo);
    }
    async updateCondo(req: Request): Promise<Condo> {
        console.log("[PUT] /condo controller", req.body);
        const { id, name, address } = req.body;
        if (!id || !name || !address) {
            throw new RequestDataValidation("Data is missing");
        }

        const condo:Condo = {
            id,
            name,
            address,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await this.condoRepository.update(condo);
    }
}