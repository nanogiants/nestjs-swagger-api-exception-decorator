/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { BaseException, ExceptionWithoutError, UserUnauthorizedException } from './exceptions/BaseException';
import { BaseExceptionType } from './type/base-exception.type';
import { SwaggerAnnotations } from './type/swagger-annotation.type';
import { ApiException, buildPlaceholder, buildTemplatedApiExceptionDecorator } from '../../lib';

const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  description: '$description',
});

const TemplatedApiExceptionWithRequiredProperties = buildTemplatedApiExceptionDecorator(
  {
    statusCode: '$status',
    description: '$description',
    error: '$error',
    reasons: [],
    fixedValue: 123,
  },
  {
    requiredProperties: ['description', 'reasons'],
  },
);

const TemplatedApiExceptionWithCustomPlaceholder = buildTemplatedApiExceptionDecorator(
  {
    statusCode: '$status',
    description: '$description',
    clientCode: '$clientCode',
    error: '$error',
    missingPlaceholder: '$not_existing',
  },
  {
    requiredProperties: ['description', 'statusCode'],
    placeholders: {
      clientCode: buildPlaceholder(
        () => BaseException,
        exception => exception.getClientCode(),
      ),
    },
  },
);

const TemplatedApiExceptionWithTemplateType = buildTemplatedApiExceptionDecorator(() => BaseExceptionType);

jest.mock('@nestjs/swagger', () => {
  const {
    ApiOperation: ActualApiOperation,
    ApiResponse: ActualApiResponse,
    ...otherImplementations
  } = jest.requireActual('@nestjs/swagger');

  return {
    ...otherImplementations,
    ApiResponse: jest.fn((options: ApiResponseOptions) => ActualApiResponse(options)),
    ApiOperation: (options: ApiOperationOptions) => ActualApiOperation(options),
  };
});

class CustomBadRequestException extends BadRequestException {
  constructor() {
    super('Bad Request');
  }
}

class CustomBadRequestException2 extends BadRequestException {
  constructor() {
    super('Bad Request 2');
  }
}

class CustomNotFoundException extends NotFoundException {
  constructor() {
    super('Custom Not Found');
  }
}

class CustomNotFoundExceptionWithArrayMessage extends NotFoundException {
  constructor(messages: string[]) {
    super(messages.join(', '));
  }
}

describe('Decorator', () => {
  const ApiResponseMock = ApiResponse as unknown as jest.Mock<typeof ApiResponse>;

  beforeEach(() => {
    ApiResponseMock.mockClear();
  });

  describe('@ApiException - single exception', () => {
    describe('given valid NestJS built in exception without template or description', () => {
      it('should use the default template', () => {
        class DefaultTemplate {
          @ApiException(() => BadRequestException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS subclassed exception without error', () => {
      it('should use the default template', () => {
        class DefaultTemplate {
          @ApiException(() => ExceptionWithoutError)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception (forbidden exception) without template or description', () => {
      it('should use the default template including the error property', () => {
        class DefaultTemplateWithError {
          @ApiException(() => ForbiddenException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with description', () => {
      it('should use the default template', () => {
        class DefaultTemplateWithDescription {
          @ApiException(() => BadRequestException, { description: 'This is a test' })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with description and schema', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(() => BadRequestException, {
            description: 'This is a test',
            messageSchema: {
              description: 'custom message schema',
              type: 'string',
              example: {
                test: {},
              },
            },
          })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with type', () => {
      it('should use the default template', () => {
        class DefaultTemplateWithType {
          @ApiException(() => BadRequestException, {
            type: () => SwaggerAnnotations,
          })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with type and isArray equal true', () => {
      it('should use the default template', () => {
        class DefaultTemplateWithTypeAndIsArray {
          @ApiException(() => BadRequestException, {
            type: () => SwaggerAnnotations,
            isArray: true,
          })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });

  describe('@ApiException - multiple exceptions', () => {
    describe('given valid subclassed HttpExceptions', () => {
      it('should build the api-response payload properly', () => {
        class CorrectPayload {
          @TemplatedApiException(() => [CustomBadRequestException, CustomBadRequestException2])
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given exceptions mismatching http status codes', () => {
      it('should build the api-response payload properly', () => {
        class ShowWarningButBuildCorrectPayload {
          @TemplatedApiException(() => [CustomBadRequestException, NotFoundException])
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(ShowWarningButBuildCorrectPayload.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });

    describe('given valid HttpExceptions should be consecutive numbered', () => {
      it('should build the api-response payload properly', () => {
        class GroupedPayload {
          @TemplatedApiException(() => NotFoundException)
          @TemplatedApiException(() => BadRequestException)
          @TemplatedApiException(() => NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupedPayload.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });
  });

  describe('@TemplatedApiException - single exception', () => {
    describe('given valid subclassed HttpException', () => {
      it('should build the api-response payload properly', () => {
        class SingleExceptionCorrectPayload {
          @TemplatedApiException(() => NotFoundException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given a directly instantiated exception', () => {
      it('should should use the already instantiated exception', () => {
        class InstantiatedException {
          @TemplatedApiException(() => new CustomNotFoundExceptionWithArrayMessage(['hallo']))
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given a non instantiated exception', () => {
      it('should should use the already instantiated exception', () => {
        try {
          class NonInstantiableException {
            @TemplatedApiException(() => CustomNotFoundExceptionWithArrayMessage)
            test() {
              return;
            }
          }
        } catch (error) {
          expect(error.message.indexOf('Could not instantiate exception')).toBe(0);
        }
      });
    });

    describe('given a template which does not contain an available placeholder', () => {
      const Decorator = buildTemplatedApiExceptionDecorator({ test: 'test' });

      it('should should use the already instantiated exception', () => {
        class TemplateWithoutPlaceholder {
          @Decorator(() => NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(TemplateWithoutPlaceholder.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });

    describe('given no template', () => {
      const Decorator = buildTemplatedApiExceptionDecorator(null);

      it('should should use the already instantiated exception', () => {
        class NoTemplate {
          @Decorator(() => NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(NoTemplate.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });
  });

  describe('@TemplatedApiExceptionWithRequiredProperties - with some required properties', () => {
    it('should properly define the required properties', () => {
      @TemplatedApiExceptionWithRequiredProperties(() => CustomBadRequestException)
      @TemplatedApiExceptionWithRequiredProperties(() => [CustomNotFoundException, NotFoundException])
      class RequiredProperties {
        @ApiOperation({ description: 'test' })
        @TemplatedApiExceptionWithRequiredProperties(() => new CustomNotFoundExceptionWithArrayMessage(['hallo']))
        test() {
          return;
        }
      }

      const descriptor = Object.getOwnPropertyDescriptor(RequiredProperties.prototype, 'test');
      const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

      expect(meta).toMatchSnapshot();
    });
  });

  describe('@TemplatedApiExceptionWithCustomPlaceholder - with some custom placeholders', () => {
    it('should properly use the custom placeholder resolvers', () => {
      class CustomPlaceholders {
        @ApiOperation({ description: 'test' })
        @TemplatedApiExceptionWithCustomPlaceholder(() => [UserUnauthorizedException, BadRequestException])
        test() {
          return;
        }
      }

      const descriptor = Object.getOwnPropertyDescriptor(CustomPlaceholders.prototype, 'test');
      const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

      expect(meta).toMatchSnapshot();
    });
  });

  describe('@TemplatedApiExceptionWithTemplateType', () => {
    it('should properly use the template type', () => {
      class TemplateType {
        @ApiOperation({ description: 'test' })
        @TemplatedApiExceptionWithTemplateType(() => [UserUnauthorizedException, BadRequestException])
        test() {
          return;
        }
      }

      const descriptor = Object.getOwnPropertyDescriptor(TemplateType.prototype, 'test');
      const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

      expect(meta).toMatchSnapshot();
    });
  });

  describe('usage of multiple @ApiException', () => {
    describe('given multiple @ApiException decorators', () => {
      describe('when method has @ApiOperation attached', () => {
        it('should be grouped correctly', () => {
          @TemplatedApiException(() => CustomBadRequestException)
          @TemplatedApiException(() => [CustomNotFoundException, NotFoundException])
          class GroupTest1 {
            @ApiOperation({ description: 'test' })
            @TemplatedApiException(() => new CustomNotFoundExceptionWithArrayMessage(['hallo']))
            test() {
              return;
            }
          }

          const descriptor = Object.getOwnPropertyDescriptor(GroupTest1.prototype, 'test');
          const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

          expect(meta).toMatchSnapshot();
        });
      });

      describe('when method has @ApiOperation not attached', () => {
        it('should not attach the class exception decorator', () => {
          @TemplatedApiException(() => CustomBadRequestException)
          @TemplatedApiException(() => [CustomNotFoundException, NotFoundException])
          class GroupTest2 {
            test() {
              return;
            }
          }

          const descriptor = Object.getOwnPropertyDescriptor(GroupTest2.prototype, 'test');
          const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

          expect(meta).toBeUndefined();
        });
      });
    });

    describe('when method has the same exception attached multiple times, but with different descriptions', () => {
      it('should group the exceptions properly', () => {
        @TemplatedApiException(() => CustomBadRequestException, { description: 'One more at class level' })
        class GroupTest3 {
          @TemplatedApiException(() => CustomBadRequestException)
          @TemplatedApiException(() => CustomBadRequestException, { description: 'Test' })
          @TemplatedApiException(() => CustomBadRequestException, { description: 'One more just for testing' })
          @ApiOperation({})
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupTest3.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });

    describe('when method has the same exception attached multiple times, but with different instantiated exceptions', () => {
      it('should group the exceptions properly', () => {
        class GroupTest4 {
          @TemplatedApiException(() => [new BadRequestException('test'), new BadRequestException('test 2')])
          @ApiOperation({})
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupTest4.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });
  });
});
