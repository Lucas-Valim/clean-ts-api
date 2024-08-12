export class ServerError extends Error {
  constructor (paramName: string) {
    super('Internal server error')
    this.name = 'ServerError'
  }
}
