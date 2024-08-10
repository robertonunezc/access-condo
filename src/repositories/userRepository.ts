import { Knex } from 'knex';
import { User } from '../entities/user';

export class UserRepository {
    private knex: Knex;

    constructor(knex: Knex) {
      this.knex = knex;
    }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.knex('users').where({ id }).first();
    if (!user) return null;
    return new User(user.name, user.email, user.phone);
  }
  async findAllUsers(): Promise<User[]> {
    const users = await this.knex('users');
    return users.map((user) => new User(user.name, user.email, user.phone));
  }
    async createUser(user: User): Promise<User> {
        const [id] = await this.knex('users').insert(user);
        return new User(user.name, user.email, user.phone, id);
    }
}