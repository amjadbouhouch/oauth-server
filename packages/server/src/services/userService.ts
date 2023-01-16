import { IService } from '../interfaces/IService';
import { injectable } from 'inversify';
import { UserRepository } from '../Repository';
import { User } from '@oauth/db-client';
import { BCryptService, UnauthorizedError, NotFoundError } from 'middleware';

@injectable()
export class UserService implements IService<User> {
  constructor(private readonly _userRepository: UserRepository, private readonly _bcryptService: BCryptService) {}

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    console.log(email);

    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('wrong email or password');
    const isMatched = await this._bcryptService.compare(password, user.password);
    if (!isMatched) throw new UnauthorizedError('wrong email or password');
    return user;
  }
  create(payload: any): Promise<void | User> {
    throw new Error('Method not implemented.');
  }

  async retrieve(id: string): Promise<User> {
    const user = await this._userRepository.retrieve(id);
    if (!user) {
      throw new NotFoundError();
    }
    const { password, createdAt, updatedAt, ...rest } = user;
    return rest as User;
  }
  update(payload: Partial<User>): Promise<void | User> {
    return this._userRepository.update(payload);
  }
  delete(id: string): Promise<void> {
    return this._userRepository.delete(id);
  }
  list() {
    return this._userRepository.list();
  }
}
