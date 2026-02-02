import { ApiProperty } from '@nestjs/swagger';

import { DestinationModel } from './destination.entity';
import { UserModel } from './user.entity';

export class ActivityModel {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
  })
  destinationId: string;
  @ApiProperty({
    type: () => DestinationModel,
    required: false,
  })
  destination?: DestinationModel;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: () => UserModel,
    required: false,
  })
  user?: UserModel;
}
