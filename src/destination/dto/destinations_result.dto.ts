import { ApiProperty } from '@nestjs/swagger';
import { DestinationModel } from 'generated/nestjs-dto/destination.entity';

export class GetAllDestinationsResponseDto {
  @ApiProperty({
    type: [DestinationModel],
  })
  destinations: DestinationModel[];
}
