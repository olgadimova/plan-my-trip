import { ApiProperty } from '@nestjs/swagger';

import { ActivityModel } from './activity.entity';
import { UserModel } from './user.entity';

export class DestinationModel {
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
    format: 'date-time',
  })
  dueDate: Date;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: () => UserModel,
    required: false,
  })
  user?: UserModel;
  @ApiProperty({
    type: () => ActivityModel,
    isArray: true,
    required: false,
  })
  Activity?: ActivityModel[];
}
