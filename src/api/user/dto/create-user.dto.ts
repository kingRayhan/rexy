export class CreateUserDto {
  name?: string;
  avatar?: string;
  username: string;
  email: string;
  password: string;
  emailConfirmed?: boolean;
}
