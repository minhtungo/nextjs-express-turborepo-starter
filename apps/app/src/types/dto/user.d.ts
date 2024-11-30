export interface UserDTO extends ApiResponseType {
  data: {
    id: string;
    email: string;
    name: string;
  };
}
