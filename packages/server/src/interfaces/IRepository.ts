import { DBClient } from '@oauth/db-client';
export interface IRepository<T> {
  create(payload): Promise<T>;
  list(): Promise<T[]>;
  retrieve(id: string): Promise<T>;
  update(payload): Promise<void | T>;
  delete(id: string): Promise<void>;
}
