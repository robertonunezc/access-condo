import { Knex } from "knex";
import { CondoRepository } from "../repositories/condoRepository";
import { RequestDataValidation } from "../errors/exceptions";
import { Request } from "express";
import { Condo } from "../entities/condo";
import { UserRepository } from "../repositories";

export class CondoCtrl {
    private condoRepository: CondoRepository;
    private userRepository: UserRepository;

    constructor(knex: Knex) {
        this.condoRepository = new CondoRepository(knex);
        this.userRepository = new UserRepository(knex);
    }

    async getAllCondos() {
        const condos = await this.condoRepository.findAll();
        console.log(condos)
        return await this.condoRepository.findAll();
    }

    async createCondo(req: Request): Promise<Condo> {
        const { name, address, manager_id } = req.body;
        if (!name || !address) {
            throw new RequestDataValidation("Data is missing");
        }

        const manager = await this.userRepository.findById(manager_id);
        if (!manager) {
            throw new RequestDataValidation("Manager not found");
        }
        const condo:Condo = {
            name,
            address,
            manager,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await this.condoRepository.create(condo);
    }
    async updateCondo(req: Request): Promise<Condo> {
        const { id, name, address, manager_id } = req.body;
        if (!id || !name || !address) {
            throw new RequestDataValidation("Data is missing");
        }
        const manager = await this.userRepository.findById(manager_id);
        if (!manager) {
            throw new RequestDataValidation("Manager not found");
        }
        const condo:Condo = {
            id,
            name,
            address,
            manager,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await this.condoRepository.update(condo);
    }
}