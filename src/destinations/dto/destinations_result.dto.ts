import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class DestinationResultModel {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @Expose()
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

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  @Expose({ name: 'due_date', toPlainOnly: true })
  dueDate: Date;

  @ApiProperty({
    type: 'string',
  })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string;
}

export class GetAllDestinationsResponseDto {
  @ApiProperty({
    type: [DestinationResultModel],
  })
  destinations: DestinationResultModel[];
}
