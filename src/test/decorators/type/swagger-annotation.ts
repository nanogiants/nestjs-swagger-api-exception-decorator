import { ApiProperty } from '@nestjs/swagger';

enum ErrorTypes {
  LOG = 'LOG',
  WARN = 'WARN',
}

class OneMoreSubclass {
  @ApiProperty({ type: Boolean })
  bool: boolean;

  @ApiProperty({ type: String, example: '$description' })
  desc: string;

  @ApiProperty({ enum: ErrorTypes })
  exampleEnum: ErrorTypes;
}

class Subclass {
  @ApiProperty({ type: Number })
  property3: string;

  @ApiProperty({ type: OneMoreSubclass, isArray: true })
  subsub: OneMoreSubclass;
}

export class SwaggerAnnotations {
  @ApiProperty({ type: () => Number })
  property1: number;

  @ApiProperty({ type: Subclass })
  property2: Subclass;

  @ApiProperty({ type: Boolean })
  property4: boolean;

  @ApiProperty({ type: Number, example: '$status' })
  statusCode: number;
}
