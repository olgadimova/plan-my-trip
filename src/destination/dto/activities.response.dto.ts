import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseModel } from '../../shared/dto';

export class ActivitiesResponseDto {
  @ApiProperty({
    type: [ActivityResponseModel],
  })
  activities: ActivityResponseModel[];
}
