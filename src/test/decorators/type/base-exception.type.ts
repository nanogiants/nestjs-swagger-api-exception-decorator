import { ApiProperty } from '@nestjs/swagger';

export class BaseExceptionType {
  @ApiProperty({ example: '$status', required: true })
  statusCode: number;

  @ApiProperty({ example: '$description', required: true })
  message: string;

  @ApiProperty({ example: '$error', isArray: true })
  error: string[];
}
