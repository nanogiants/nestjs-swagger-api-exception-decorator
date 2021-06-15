import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiException,
  buildTemplatedApiExceptionDecorator,
  buildPlaceholder,
} from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { AppService } from './app.service';
import {
  CustomNotFoundException,
  EmailResponseFailedException,
  InternalServerException,
  MissingPropertyException,
  PayloadMissingException,
} from './exceptions';
import { ApiExtraModels, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import {
  BaseExceptionTemplate,
  SwaggerAnnotations,
} from './swagger-annotations';
import {
  BaseException,
  UserUnauthorizedException,
} from './exceptions/placeholders/exceptions';

const TemplatedApiException = buildTemplatedApiExceptionDecorator(
  {
    statusCode: '$status',
    timestamp: '01.01.1970T15:30:11',
    path: 'string',
    message: '$description',
    reasons: 'string',
    clientCode: '$clientCode',
  },
  {
    requiredProperties: ['statusCode', 'message', 'timestamp'],
    placeholders: {
      clientCode: buildPlaceholder(
        () => BaseException,
        (exception) => exception.getClientCode(),
      ),
    },
  },
);

@Controller()
@ApiException(() => UnauthorizedException, {
  description: 'User is not authorized',
})
@ApiExtraModels(SwaggerAnnotations, BaseExceptionTemplate)
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
  @ApiException(() => [NotFoundException, BadRequestException], {
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
  @ApiException(() => BadRequestException, {
    type: () => SwaggerAnnotations,
  })
  @ApiException(() => NotFoundException, { type: () => SwaggerAnnotations })
  @ApiException(() => UnauthorizedException, {
    type: () => SwaggerAnnotations,
  })
  @ApiException(() => ConflictException, { type: () => SwaggerAnnotations })
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
    CustomNotFoundException,
    UserUnauthorizedException,
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

  // @Put('/exception')
  // @ApiOperation({
  //   summary: 'This is an example with an error',
  // })
  // @ApiException(() => BadRequestException, {
  //   template: () => SwaggerAnnotations,
  // })
  // throwExceptionWithAnnotatedTemplate() {
  //   throw new BadRequestException();
  // }

  @Get('issue26')
  @ApiOperation({
    summary: 'This is an example for issue #26',
  })
  @ApiException(() => [EmailResponseFailedException, InternalServerException])
  issue26() {
    throw new EmailResponseFailedException();
  }
}
