
import{ Request } from "express";
import { UserRepository } from "../repositories";
import { Knex } from "knex";
import { EmailService } from "../infra/email";
export interface AuthResponse{
    token: string;
}
export class AuthCtrl {
    private userRepository: UserRepository;
    private emailServices: EmailService;
  constructor(db:Knex) {
    this.userRepository = new UserRepository(db);
    this.emailServices = new EmailService();
  }
  

  async login(req: Request):Promise<AuthResponse> {
    console.log("[POST] /login controller", req.body);
    const { email } = req.body;
    if (!email) {
     throw new Error("Credentials are missing");
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    // Send email to user with one time generated code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const emailText = `Your one time code is ${code}`;
    await this.emailServices.sendEmail(user.email, "CondoApp code", emailText);
    return { token: "token" };
    }   
}