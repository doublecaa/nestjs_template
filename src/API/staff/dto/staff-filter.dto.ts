import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class staffFilterDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ default: 0, required: false })
  @Type(() => Number)
  skip: number;

  @ApiProperty({ default: 20, required: false })
  @Type(() => Number)
  take: number;

  @ApiProperty({ default: 'createdAt', required: false })
  key: string;

  @ApiProperty({ default: 'desc', required: false })
  value: string;
}
