export interface IService {
  list(): Promise<unknown>;
  retrieve(id: string): Promise<unknown>;
  update(payload): Promise<unknown>;
  create(payload): Promise<unknown>;
  delete(id: string): Promise<unknown>;
}
