export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class CustomError extends Error {
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
  }
}
