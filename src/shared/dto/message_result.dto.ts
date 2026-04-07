import { ApiProperty } from '@nestjs/swagger';

export class MessageResultDto {
  @ApiProperty({ type: String })
  message: string;
}
