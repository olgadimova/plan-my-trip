import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../prisma/client';
import { ActivityModel } from './activity.entity';
import { DestinationModel } from './destination.entity';

export class UserModel {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
    enum: Role,
    enumName: 'Role',
  })
  role: Role;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  name: string | null;
  @ApiProperty({
    type: () => DestinationModel,
    isArray: true,
    required: false,
  })
  Destination?: DestinationModel[];
  @ApiProperty({
    type: () => ActivityModel,
    isArray: true,
    required: false,
  })
  Activity?: ActivityModel[];
}
