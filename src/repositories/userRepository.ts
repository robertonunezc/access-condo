import { Knex } from 'knex';
import { User } from '../entities/user';
import { CRUDInterface } from './crudInterface';

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
      const userCreated = await this.knex('users').insert({
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
        return userCreated[0];
    }
    async update(id: string, user: User): Promise<User> {
        const userCreated= await this.knex('users').where({ id: id }).update(user).select('*');
        return userCreated[0];
    }
}