import { ApiProperty } from '@nestjs/swagger';

enum ErrorTypes {
  FATAL,
  WARN,
  INFO,
}

export class SwaggerAnnotations {
  @ApiProperty({ enum: ErrorTypes, enumName: 'ErrorTypes' })
  error: ErrorTypes;
}

export class BaseExceptionTemplate {
  @ApiProperty({ required: true, type: Number })
  statusCode: number;

  @ApiProperty({ required: false, type: Number })
  clientCode: string;

  @ApiProperty({ required: true, type: String })
  message: string;

  @ApiProperty({ required: false, type: [String] })
  errors: string[];

  @ApiProperty({ required: false, type: String })
  path: string;

  @ApiProperty({ required: false, type: String })
  timestamp: string;
}
