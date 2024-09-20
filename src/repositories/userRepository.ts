import { Knex } from 'knex';
import { User } from '../entities/user';
import { CRUDInterface } from './crudInterface';
import { RequestDataValidation } from '../errors/exceptions';

export class UserRepository implements CRUDInterface{
    private knex: Knex;

    constructor(knex: Knex) {
      this.knex = knex;
    }

  async findById(id: string): Promise<User | null> {
    const user = await this.knex('users').where({ id }).first();
    if (!user) return null;
    return user;
  }
  async findAll(): Promise<User[]> {
    return await this.knex<User>('users');
  }
    async create(user: User): Promise<User> {
      console.log("UserRepository.create", user);
      if(await this.checkUserExists(user.email, user.username)){
        throw new RequestDataValidation("Please, try again. User already exists");
      }
      const userCreatedId = await this.knex('users').insert({
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: User.convertUsersTypeToString(user.type),
        username: user.username,
        password: user.password,
        token: user.token,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }).select('*');
      const userCreated = await this.knex<User>('users').where({ id: userCreatedId[0] }).select('*');
        return userCreated[0];
    }
    async checkUserExists(email: string, username:string): Promise<boolean> {
        const user:User = await this.knex('users').where({ email, username }).first();
        return !!user;
    }
    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.knex('users').where({ email }).first();
        if (!user) return null;
        return user;
    }
    async update(id: string, user: Partial<User>): Promise<User> {
        await this.knex('users').where({ id: id }).update(user).select('*');
        const updatedUser = await this.knex<User>('users').where({ id }).first();
        return updatedUser!;
    }
}