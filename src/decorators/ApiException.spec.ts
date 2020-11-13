// tslint:disable: max-classes-per-file

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

import { buildTemplatedApiExceptionDecorator } from './ApiException';

const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  description: '$description',
});

const { ApiResponse: ActualApiResponse } = jest.requireActual('@nestjs/swagger');

jest.mock('@nestjs/swagger', () => {
  return {
    ApiResponse: jest.fn((options: ApiResponseOptions) => ActualApiResponse(options)),
  };
});

export class CustomBadRequestException extends BadRequestException {
  constructor() {
    super('Bad Request');
  }
}

export class CustomBadRequestException2 extends BadRequestException {
  constructor() {
    super('Bad Request 2');
  }
}

export class CustomNotFoundException extends NotFoundException {
  constructor() {
    super('Not Found');
  }
}

export class CustomNotFoundExceptionWithArrayMessage extends NotFoundException {
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
    describe('given multiple @ApiException decorators with same status codes', () => {
      it('should be grouped correctly', () => {
        @TemplatedApiException(CustomBadRequestException)
        @TemplatedApiException(NotFoundException)
        @TemplatedApiException(CustomNotFoundException)
        class GroupTest {
          @TemplatedApiException(CustomNotFoundException)
          @TemplatedApiException(new CustomNotFoundExceptionWithArrayMessage(['hallo']))
          test() {
            return;
          }
        }

        const args = ApiResponseMock.mock.calls;

        expect(args[0][0]).toEqual(
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
                  CustomNotFoundException: {
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

        expect(args[1][0]).toEqual(
          expect.objectContaining({
            status: 404,
            content: {
              'application/json': {
                examples: {
                  CustomNotFoundException: {
                    description: 'Not Found',
                    value: {
                      statusCode: 404,
                      description: 'Not Found',
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
});
