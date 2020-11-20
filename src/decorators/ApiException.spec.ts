// tslint:disable: max-classes-per-file

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { buildTemplatedApiExceptionDecorator } from './ApiException';

const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  description: '$description',
});

const { ApiOperation: ActualApiOperation, ApiResponse: ActualApiResponse } = jest.requireActual('@nestjs/swagger');

jest.mock('@nestjs/swagger', () => {
  return {
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
    super('Not Found');
  }
}

class CustomNotFoundExceptionWithArrayMessage extends NotFoundException {
  constructor(messages: string[]) {
    super(messages.join(', '));
  }
}

describe('Decorator', () => {
  const ApiResponseMock = ApiResponse as jest.Mock<typeof ApiResponse>;

  beforeEach(() => {
    ApiResponseMock.mockClear();
  });

  describe('@ApiException - multiple exceptions', () => {
    describe('given valid subclassed HttpExceptions', () => {
      it('should build the api-response payload properly', () => {
        class Ignore {
          @TemplatedApiException([CustomBadRequestException, CustomBadRequestException2])
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            status: 400,
            content: {
              'application/json': {
                examples: {
                  CustomBadRequestException: {
                    description: 'Bad Request',
                    value: {
                      statusCode: 400,
                      description: 'Bad Request',
                    },
                  },
                  CustomBadRequestException2: {
                    description: 'Bad Request 2',
                    value: {
                      statusCode: 400,
                      description: 'Bad Request 2',
                    },
                  },
                },
              },
            },
          }),
        );
      });
    });

    describe('given exceptions mismatching http status codes', () => {
      let spy: jest.SpyInstance;

      beforeEach(() => {
        // tslint:disable-next-line: no-empty
        spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it('should build the api-response payload properly but print a warning too', () => {
        class Ignore {
          @TemplatedApiException([CustomBadRequestException, NotFoundException])
          test() {
            return;
          }
        }

        expect(spy).toBeCalled();

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            status: 400,
            content: {
              'application/json': {
                examples: {
                  CustomBadRequestException: {
                    description: 'Bad Request',
                    value: {
                      statusCode: 400,
                      description: 'Bad Request',
                    },
                  },
                  NotFoundException: {
                    description: 'Not Found',
                    value: {
                      statusCode: 404,
                      description: 'Not Found',
                    },
                  },
                },
              },
            },
          }),
        );
      });
    });
  });

  describe('@ApiException - single exception', () => {
    describe('given valid subclassed HttpException', () => {
      it('should build the api-response payload properly', () => {
        class Ignore {
          @TemplatedApiException(NotFoundException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            status: 404,
            content: {
              'application/json': {
                examples: {
                  NotFoundException: {
                    description: 'Not Found',
                    value: {
                      statusCode: 404,
                      description: 'Not Found',
                    },
                  },
                },
              },
            },
          }),
        );
      });
    });

    describe('given a directly instantiated exception', () => {
      it('should should use the already instantiated exception', () => {
        class Ignore {
          @TemplatedApiException(new CustomNotFoundExceptionWithArrayMessage(['hallo']))
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            status: 404,
            content: {
              'application/json': {
                examples: {
                  CustomNotFoundExceptionWithArrayMessage: {
                    description: 'hallo',
                    value: {
                      statusCode: 404,
                      description: 'hallo',
                    },
                  },
                },
              },
            },
          }),
        );
      });
    });

    describe('given a non instantiated exception', () => {
      it('should should use the already instantiated exception', () => {
        try {
          class Ignore {
            @TemplatedApiException(CustomNotFoundExceptionWithArrayMessage)
            test() {
              return;
            }
          }
        } catch (error) {
          expect(error.message.indexOf('Could not instantiate exception')).toBe(0);
        }
      });
    });
  });

  describe('usage of multiple @ApiException', () => {
    describe('given multiple @ApiException decorators', () => {
      describe('when method has @ApiOperation attached', () => {
        it('should be grouped correctly', () => {
          @TemplatedApiException(CustomBadRequestException)
          @TemplatedApiException([CustomNotFoundException, NotFoundException])
          class GroupTest {
            @ApiOperation({ description: 'test' })
            @TemplatedApiException(new CustomNotFoundExceptionWithArrayMessage(['hallo']))
            test() {
              return;
            }
          }

          const descriptor = Object.getOwnPropertyDescriptor(GroupTest.prototype, 'test');
          const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

          expect(meta).toEqual(
            expect.objectContaining({
              '400': {
                content: {
                  'application/json': {
                    examples: {
                      CustomBadRequestException: {
                        description: 'Bad Request',
                        value: { description: 'Bad Request', statusCode: 400 },
                      },
                    },
                  },
                },
                description: '',
                isArray: undefined,
                type: undefined,
              },
              '404': {
                content: {
                  'application/json': {
                    examples: {
                      CustomNotFoundException: {
                        description: 'Not Found',
                        value: { description: 'Not Found', statusCode: 404 },
                      },
                      CustomNotFoundExceptionWithArrayMessage: {
                        description: 'hallo',
                        value: { description: 'hallo', statusCode: 404 },
                      },
                      NotFoundException: {
                        description: 'Not Found',
                        value: { description: 'Not Found', statusCode: 404 },
                      },
                    },
                  },
                },
                description: '',
                isArray: undefined,
                type: undefined,
              },
            }),
          );
        });
      });

      describe('when method has @ApiOperation not attached', () => {
        it('should not attach the class exception decorator', () => {
          @TemplatedApiException(CustomBadRequestException)
          @TemplatedApiException([CustomNotFoundException, NotFoundException])
          class GroupTest {
            test() {
              return;
            }
          }

          const descriptor = Object.getOwnPropertyDescriptor(GroupTest.prototype, 'test');
          const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

          expect(meta).toBeUndefined();
        });
      });
    });

    describe('when method has the same exception attached multiple times, but with different descriptions', () => {
      it('should group the exceptions properly', () => {
        @TemplatedApiException(CustomBadRequestException, { description: 'One more at class level' })
        class GroupTest1 {
          @TemplatedApiException(CustomBadRequestException)
          @TemplatedApiException(CustomBadRequestException, { description: 'Test' })
          @TemplatedApiException(CustomBadRequestException, { description: 'One more just for testing' })
          @ApiOperation({})
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupTest1.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toEqual(
          expect.objectContaining({
            '400': {
              content: {
                'application/json': {
                  examples: {
                    'CustomBadRequestException #1': {
                      description: 'One more just for testing',
                      value: { description: 'Bad Request', statusCode: 400 },
                    },
                    'CustomBadRequestException #2': {
                      description: 'Test',
                      value: { description: 'Bad Request', statusCode: 400 },
                    },
                    'CustomBadRequestException #3': {
                      description: 'Bad Request',
                      value: { description: 'Bad Request', statusCode: 400 },
                    },
                    'CustomBadRequestException #4': {
                      description: 'One more at class level',
                      value: { description: 'Bad Request', statusCode: 400 },
                    },
                  },
                },
              },
              description: '',
              isArray: undefined,
              type: undefined,
            },
          }),
        );
      });
    });
  });
});
