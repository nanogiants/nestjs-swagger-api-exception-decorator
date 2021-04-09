/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { ApiException, buildTemplatedApiExceptionDecorator } from '../';

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

  describe('@ApiException - single exception', () => {
    describe('given valid NestJS built in exception without template or description', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            content: {
              'application/json': {
                examples: {
                  BadRequestException: {
                    description: 'Bad Request',
                    value: {
                      error: 'Bad Request',
                      message: 'Bad Request',
                      statusCode: 400,
                    },
                  },
                },
              },
            },
          }),
        );
      });
    });

    describe('given valid NestJS built in exception (forbidden exception) without template or description', () => {
      it('should use the default template including the error property', () => {
        class Ignore {
          @ApiException(ForbiddenException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            content: {
              'application/json': {
                examples: {
                  ForbiddenException: {
                    description: 'Forbidden',
                    value: {
                      error: 'Forbidden',
                      message: 'Forbidden',
                      statusCode: 403,
                    },
                  },
                },
              },
            },
            status: 403,
          }),
        );
      });
    });

    describe('given valid NestJS built in exception without template but with description', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException, { description: 'This is a test' })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            content: {
              'application/json': {
                examples: {
                  BadRequestException: {
                    description: 'This is a test',
                    value: {
                      error: 'Bad Request',
                      message: 'Bad Request',
                      statusCode: 400,
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
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

    describe('given valid HttpExceptions should be consecutive numbered', () => {
      it('should build the api-response payload properly', () => {
        class Ignore {
          @TemplatedApiException(NotFoundException)
          @TemplatedApiException(BadRequestException)
          @TemplatedApiException(NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(Ignore.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toEqual(
          expect.objectContaining({
            '400': {
              content: {
                'application/json': {
                  examples: {
                    BadRequestException: {
                      description: 'Bad Request',
                      value: { description: 'Bad Request', statusCode: 400 },
                    },
                  },
                },
              },
              description: '',
            },
            '404': {
              content: {
                'application/json': {
                  examples: {
                    'NotFoundException #1': {
                      description: 'Not Found',
                      value: { description: 'Not Found', statusCode: 404 },
                    },
                    'NotFoundException #2': {
                      description: 'Not Found',
                      value: { description: 'Not Found', statusCode: 404 },
                    },
                  },
                },
              },
              description: '',
            },
          }),
        );
      });
    });
  });

  describe('@TemplatedApiException - single exception', () => {
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

    describe('given a template which does not contain an available placeholder', () => {
      const Decorator = buildTemplatedApiExceptionDecorator({ test: 'test' });

      it('should should use the already instantiated exception', () => {
        class Ignore {
          @Decorator(NotFoundException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            content: {
              'application/json': {
                examples: {
                  NotFoundException: {
                    description: 'Not Found',
                    value: {
                      test: 'test',
                    },
                  },
                },
              },
            },
            description: '',
            status: 404,
          }),
        );
      });
    });

    describe('given no template', () => {
      const Decorator = buildTemplatedApiExceptionDecorator(null);

      it('should should use the already instantiated exception', () => {
        class Ignore {
          @Decorator(NotFoundException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            content: {
              'application/json': {
                examples: {
                  NotFoundException: {
                    description: 'Not Found',
                    value: null,
                  },
                },
              },
            },
            description: '',
            status: 404,
          }),
        );
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
            },
          }),
        );
      });
    });

    describe('when method has the same exception attached multiple times, but with different instantiated exceptions', () => {
      it('should group the exceptions properly', () => {
        class GroupTest2 {
          @TemplatedApiException([new BadRequestException('test'), new BadRequestException('test 2')])
          @ApiOperation({})
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupTest2.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toEqual(
          expect.objectContaining({
            '400': {
              content: {
                'application/json': {
                  examples: {
                    'BadRequestException #1': {
                      description: 'test',
                      value: {
                        statusCode: 400,
                        description: 'test',
                      },
                    },
                    'BadRequestException #2': {
                      description: 'test 2',
                      value: {
                        statusCode: 400,
                        description: 'test 2',
                      },
                    },
                  },
                },
              },
              description: '',
            },
          }),
        );
      });
    });
  });
});
