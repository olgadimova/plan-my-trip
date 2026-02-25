import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseModel {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string;
}

export class GetAllUsersResponseDto {
  @ApiProperty({
    type: [UserResponseModel],
  })
  users: UserResponseModel[];
}
