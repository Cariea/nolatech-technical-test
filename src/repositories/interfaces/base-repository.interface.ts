export interface BaseRepository<T> {
  create(item: T): Promise<T>
  findById(id: string): Promise<T | null>
  find(keyValues: Partial<T>): Promise<Array<T>>
  findAll(): Promise<T[]>
  findOne(query: any): Promise<T | null>
  update(id: string, item: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
}
