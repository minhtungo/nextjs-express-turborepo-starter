declare namespace Express {
  export interface User {
    id: string;
    email: string;
    image: string | null;
    name: string | null;
  }
}
