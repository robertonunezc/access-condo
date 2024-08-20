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
    return new User(user.name, user.email, user.phone, user.createdAt, user.updatedAt, user.id);
  }
  async findAll(): Promise<User[]> {
    const users = await this.knex('users');
    return users.map((user) => new User(user.name, user.email, user.phone,user.type, new Date(), new Date()));
  }
    async create(user: User): Promise<User> {
      const userCreated = await this.knex('users').insert(user).select('*');
        return userCreated[0];
    }
    async update(id: string, user: User): Promise<User> {
        const userCreated= await this.knex('users').where({ id: id }).update(user).select('*');
        return userCreated[0];
    }
}