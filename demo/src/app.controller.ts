import {
  BadRequestException,
  Controller,
  NotFoundException,
  Patch,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiException,
  buildTemplatedApiExceptionDecorator,
} from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { AppService } from './app.service';
import {
  MissingPropertyException,
  PayloadMissingException,
} from './exceptions';
import { ApiExtraModels, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { SwaggerAnnotations } from './swagger-annotations';

const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  timestamp: '01.01.1970T15:30:11',
  path: 'string',
  message: '$description',
  reasons: 'string',
});

@Controller()
@ApiException(() => UnauthorizedException, {
  description: 'User is not authorized',
})
@ApiExtraModels(SwaggerAnnotations)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'This is an example with custom named exceptions' })
  @ApiException(() => [MissingPropertyException, PayloadMissingException])
  createResource() {
    return 'resource has been created';
  }

  @Patch()
  @ApiOperation({
    summary: 'This is an example with nestjs default exceptions',
  })
  @ApiException(() => NotFoundException, {
    description: 'Resource could not be found',
  })
  @ApiException(() => NotFoundException, {
    description: 'Something else could not be found',
  })
  updateResource() {
    return 'resource has been updated';
  }

  @Post('/log')
  @ApiOperation({ summary: 'Log something' })
  @ApiException(() => BadRequestException, { type: () => SwaggerAnnotations })
  logSomething() {
    return 'something logged';
  }

  @Post('/log/array')
  @ApiOperation({ summary: 'Log something' })
  @ApiException(() => BadRequestException, {
    type: () => SwaggerAnnotations,
    isArray: true,
  })
  logSomethingArray() {
    return 'something logged';
  }

  @Post('/schema')
  @ApiOperation({ summary: 'Schema testing' })
  @ApiException(() => BadRequestException, {
    schema: { $ref: getSchemaPath('SwaggerAnnotations') },
  })
  schemaTest() {
    return 'something logged';
  }

  @Put()
  @ApiOperation({
    summary:
      'This is an example with custom exceptions and predefined template',
  })
  @TemplatedApiException(() => [
    MissingPropertyException,
    PayloadMissingException,
  ])
  putResource() {
    return 'resource has been updated';
  }

  @Put('/exception')
  @ApiOperation({
    summary: 'This is an example with an error',
  })
  @ApiException(() => BadRequestException, {
    description: 'Required attributes were missing',
  })
  throwException() {
    throw new BadRequestException();
  }
}
