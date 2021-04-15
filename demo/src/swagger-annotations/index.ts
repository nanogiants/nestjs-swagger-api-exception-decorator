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
