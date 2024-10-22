import { Knex } from "knex";
import { House } from "../entities/house";
import { CondoRepository, HouseRepository, UserRepository } from "../repositories";
import { RequestDataValidation } from "../errors/exceptions";
import { Request } from "express";
import { Appointment } from "../entities/appointment";

export class HouseCtrl {
    private houseRepository: HouseRepository;
    private condoRepository: CondoRepository;
    private userRepository: UserRepository;
    constructor(db: Knex) {
        this.houseRepository = new HouseRepository(db);
        this.condoRepository = new CondoRepository(db);
        this.userRepository = new UserRepository(db);
    }

    async getAllHouses(): Promise<House[]> {
        return await this.houseRepository.findAll();
    }

    async createHouse(req: Request): Promise<House> {
        const { condoId, address, ownerId } = req.body;
        if (!condoId || !address || !ownerId) {
            throw new RequestDataValidation("Data is missing");
        }
        const condo = await this.condoRepository.findById(condoId);
        if (!condo) {
            throw new RequestDataValidation("Condo not found");
        }

        const owner = await this.userRepository.findById(ownerId);
        if (!owner) {
            throw new RequestDataValidation("Owner not found");
        }
        const houseData: House = {
            address,
            condo,
            owner,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        return await this.houseRepository.create(houseData);
    }

    async updateHouse(id:string, req: Request): Promise<House> {
        const { name, address, owner } = req.body;
        if (!id || !name || !address || !owner) {
            throw new RequestDataValidation("Data is missing");
        }
        const house = new House(name, address, owner, new Date(), new Date());
        house.id = id;
        return await this.houseRepository.update(id, house);
    }
    async getHouseAppointments(id: string): Promise<Appointment[]> {
        return await this.houseRepository.getLastAppointments(id);
    }
    async getHousesByUserId(id: string): Promise<House[]> {
        return await this.houseRepository.findByUserId(id);
    }
}