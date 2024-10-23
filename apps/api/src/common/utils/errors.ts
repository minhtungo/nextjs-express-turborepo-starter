export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends PublicError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
