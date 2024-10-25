import { Knex } from "knex";
import { User } from "../../entities/user";
import { UserRepository } from "../../repositories";

export class UserService {
    private userRepository:UserRepository;
    constructor(db:Knex) {
        this.userRepository = new UserRepository(db);
    }
    async getUserByEmail(email:string):Promise<User|null> {
        return this.userRepository.getUserByEmail(email);
    }
    async setUserOTC(email:string, otc:string):Promise<User|null> {
        const user = await this.userRepository.getUserByEmail(email);
        if(!user) return null;
        user.otc = otc;
        return this.userRepository.update(user.id!,user);
    }
}