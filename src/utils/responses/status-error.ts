interface StatusErrorOptions {
  message: string
  statusCode: number
}

export class StatusError extends Error {
  readonly statusCode: number

  constructor({ message, statusCode }: StatusErrorOptions) {
    super(message)
    this.statusCode = statusCode
  }

  getStatus(): number {
    return this.statusCode
  }
}
