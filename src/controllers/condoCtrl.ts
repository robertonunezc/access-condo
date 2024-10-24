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
        console.log("Post request", req.body)
        const { name, address, manager_id } = req.body;
        if (!name || !address) {
            throw new RequestDataValidation("Data is missing");
        }

        const existManager = await this.userRepository.findById(manager_id);
        if (!existManager) {
            throw new RequestDataValidation("Manager not found");
        }
        const condo:Condo = {
            name,
            address,
            manager:existManager,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await this.condoRepository.create(condo);
    }
    async updateCondo(id:string, req: Request): Promise<Condo> {
        const { name, address, manager_id } = req.body;
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
        return await this.condoRepository.update(id, condo);
    }
}