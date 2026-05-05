import { ApiProperty } from '@nestjs/swagger';

export class MetaResultModel {
  @ApiProperty({
    type: 'number',
  })
  total: number;
  @ApiProperty({
    type: 'number',
  })
  page: number;
  @ApiProperty({
    type: 'number',
  })
  per_page: number;
  @ApiProperty({
    type: 'number',
  })
  last_page: number;
}
