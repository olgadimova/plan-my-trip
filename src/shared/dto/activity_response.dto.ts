import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ActivityResponseModel {
  @ApiProperty({
    type: 'string',
  })
  title: string;

  @ApiProperty({
    type: 'string',
  })
  description: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: Date;

  @Exclude()
  destinationId: string;

  @Exclude()
  userId: string;
}
