
import{ Request } from "express";
export interface AuthResponse{
    token: string;
}
export class AuthCtrl {
  constructor() {}
  

  async login(req: Request):Promise<AuthResponse> {
    console.log("[POST] /login controller", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
     throw new Error("Credentials are missing");
    }
     console.log("AuthCtrl.login", email, password); 
     return { token: "token" };
    }   
}