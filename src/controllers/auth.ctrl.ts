
import{ Request } from "express";
import { Knex } from "knex";
import { UserService } from "../services/user/user.services";
import { User } from "../entities/user";
import {redis} from "../infra/redis.config";
import {EmailTaskData} from "../services/worker/redis.service";
export interface AuthResponse{
    token: string;
}
export class AuthCtrl {
    private userService: UserService;

  constructor(db:Knex) {
    this.userService = new UserService(db);
  }
  

  async login(req: Request) {
    console.log("[POST] /login controller", req.body);
    const { email } = req.body;
    if (!email) {
     throw new Error("Credentials are missing");
    }
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    // Send email to user with one time generated code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const emailText = `Your one time code is ${code}`;
    // send email in bg
    const emailTaskData: EmailTaskData = {
        to: user.email,
        subject: "CondoApp code",
        message: emailText,
    }
    await redis.queue.add("sendEmail", emailTaskData);
    await this.userService.setUserOTC(user.email, code);
  }
  async verifyOtc(req: Request): Promise<User|null> {
    console.log("[POST] /verifyOtc controller", req.body);
    const { email, otc } = req.body;
    if (!email || !otc) {
        throw new Error("Credentials are missing");
    }
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.otc !== otc) {
        throw new Error("Invalid OTC");
    }
    // Invalidate OTC
    return await this.userService.setUserOTC(user.email, "");
  }   
}