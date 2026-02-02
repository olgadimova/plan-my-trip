import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateResultDto {
  @ApiProperty()
  access_token: string;
}
