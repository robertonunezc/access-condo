import { Knex } from "knex";
import { User } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";
import { Request, Response } from "express";

export class UserCtrl {
  private userRepository: UserRepository;

  constructor(db:Knex) {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async createUser(req: Request):Promise<User> {
    console.log("[POST] /user controller", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        throw new RequestDataValidation("Data is missing");
      }

    const user = new User(name, email, phone, new Date(), new Date());
    return  await this.userRepository.create(user);
  }
}

// create a custom error class
export class RequestDataValidation extends Error {
  constructor(public message: string) {
    super(message);
  }
}