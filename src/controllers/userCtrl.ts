import { Knex } from "knex";
import { User, UserType } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";
import { Request } from "express";
import { RequestDataValidation } from "../errors/exceptions";

export class UserCtrl {
  private userRepository: UserRepository;

  constructor(db:Knex) {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers():Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async createUser(req: Request):Promise<User> {
    console.log("[POST] /user controller", req.body);
    const { name, email, phone } = req.body;
    const userTypes: UserType[] = [UserType.USER];
    if (!name || !email || !phone) {
        throw new RequestDataValidation("Data is missing");
      }
    if(req.body.type !== undefined) {
     const newTypes = req.body.type.split("|").map((type: string) => User.getUserType(type));
      userTypes.push(...newTypes);
    }
    console.log("UserCtrl.createUser", name, email, phone, userTypes);
    const user = new User(name, email, phone, userTypes, new Date(), new Date());
    return  await this.userRepository.create(user);
  }
}

