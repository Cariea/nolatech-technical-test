import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose'
import { BaseRepository } from './interfaces/base-repository.interface'

export class MongooseRepository<T extends Document>
  implements BaseRepository<T>
{
  constructor(private readonly model: Model<T>) {}

  async create(item: Partial<T>): Promise<T> {
    const newItem = new this.model(item)
    return await newItem.save()
  }

  async findById(
    id: string,
    relations?: (keyof T)[],
    ignoredFields?: string[]
  ): Promise<T | null> {
    const populatedQuery = this.model.findById(id)

    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        const exclusionString = ignoredFields?.length
          ? '-' + ignoredFields.join(' -')
          : ''
        populatedQuery.populate(relation as string, exclusionString)
      })
    }

    if (ignoredFields && ignoredFields.length > 0) {
      ignoredFields.forEach((field) => {
        populatedQuery.select(`-${field}`)
      })
    }

    return await populatedQuery.exec()
  }

  async findOne(query: any): Promise<T | null> {
    return await this.model.findOne(query).exec()
  }

  async find(keyValues: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(keyValues).exec()
  }

  async findAll(
    relations?: (keyof T)[],
    ignoredFields?: string[]
  ): Promise<T[]> {
    const query = this.model.find()

    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        const exclusionString = ignoredFields?.length
          ? '-' + ignoredFields.join(' -')
          : ''
        query.populate(relation as string, exclusionString)
      })
    }

    if (ignoredFields && ignoredFields.length > 0) {
      ignoredFields.forEach((field) => {
        query.select(`-${field}`)
      })
    }

    return await query.exec()
  }

  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true }).exec()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec()
    return result !== null
  }
}
