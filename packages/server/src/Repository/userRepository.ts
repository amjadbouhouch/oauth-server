import { DbClient, NotFoundError } from 'middleware';
import { injectable } from 'inversify';
import { IRepository } from '../interfaces';
import { User } from '@oauth/db-client';

@injectable()
export class UserRepository implements IRepository<User> {
  constructor(private readonly _dbService: DbClient) {}
  list(): Promise<User[]> {
    return this._dbService.user.findMany();
  }
  async retrieve(id: string): Promise<User> {
    const user = await this._dbService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundError(`User not found with Id=${id}`);
    return user;
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await this._dbService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundError(`wrong email or password.`);
    // todo test password hash

    return user;
  }
  update(payload: Partial<User>): Promise<void | User> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
