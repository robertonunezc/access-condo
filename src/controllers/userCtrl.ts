import { Knex } from "knex";
import { User, UserType } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";
import { Request } from "express";
import { RequestDataValidation } from "../errors/exceptions";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const jwtSecret = process.env.JWT_SECRET;

export class UserCtrl {
  private userRepository: UserRepository;
  constructor(db:Knex) {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers():Promise<User[]> {
    console.log("[GET] /user controller");
    return await this.userRepository.findAll();
  }

  async createUser(req: Request):Promise<User> {
    console.log("[POST] /user controller", req.body);
    const { name, email, phone, password, username } = req.body;
    const userTypes: UserType[] = [UserType.USER];
    if (!name || !email || !phone || !password || !username) {
        throw new RequestDataValidation("Data is missing");
      }
    if(req.body.type !== undefined) {
     const newTypes = req.body.type.split("|").map((type: string) => User.getUserType(type));
      userTypes.push(...newTypes);
    }
    const passwordHashed = await this.hashPassword(password);
    const token = jwt.sign({ username, password },jwtSecret as string, {expiresIn: "24h" });
    
    const user = new User(name, email, phone, userTypes, new Date(), new Date(), username, passwordHashed, token);
    return await this.userRepository.create(user);
   
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;  // Salt rounds define the cost factor for hashing
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  }
}

