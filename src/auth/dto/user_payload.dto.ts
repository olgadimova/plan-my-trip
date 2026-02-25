import { Role } from 'generated/prisma/enums';

export class RequestUserModel {
  // userId
  sub: string;
  email: string;
  role: Role;
}
