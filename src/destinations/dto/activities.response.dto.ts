import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseModel, MetaResultModel } from '../../shared/dto';

export class ActivitiesResponseDto {
  @ApiProperty({
    type: [ActivityResponseModel],
  })
  activities: ActivityResponseModel[];
  @ApiProperty({
    type: MetaResultModel,
  })
  meta: MetaResultModel;
}
