export class UlkaError extends Error {
  constructor(message: string, public custom: string) {
    super(message)
  }
}
