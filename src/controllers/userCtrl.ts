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
    return await this.userRepository.findAllUsers();
  }

  async createUser(req: Request):Promise<User> {
    console.log("[POST] /user controller", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        throw new RequestDataValidation("Data is missing");
      }
    const user = new User(name, email, phone);
    return  await this.userRepository.createUser(user);
  }
}

// create a custom error class
export class RequestDataValidation extends Error {
  constructor(public message: string) {
    super(message);
  }
}