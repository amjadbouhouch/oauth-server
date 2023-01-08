export interface IService<T> {
  list(): Promise<T[]>;
  retrieve(id: string): Promise<T>;
  update(payload): Promise<void | T>;
  create(payload): Promise<void | T>;
  delete(id: string): Promise<void>;
}
