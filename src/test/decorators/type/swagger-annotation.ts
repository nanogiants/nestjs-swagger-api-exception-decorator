import { ApiProperty } from '@nestjs/swagger';

export class SwaggerAnnotations {
  @ApiProperty()
  test: string;
}
