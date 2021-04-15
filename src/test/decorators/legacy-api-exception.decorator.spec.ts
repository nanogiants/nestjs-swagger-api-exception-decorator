// TODO: Remove this file if the deprecated decorator signature has been removed

/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiOperationOptions, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

import { ApiException, buildTemplatedApiExceptionDecorator } from '../../lib';

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

const TemplatedApiException = buildTemplatedApiExceptionDecorator({});

describe('Decorator', () => {
  const ApiResponseMock = ApiResponse as jest.Mock<typeof ApiResponse>;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    ApiResponseMock.mockClear();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  describe('@ApiException - single exception', () => {
    describe('given valid NestJS built in exception without template or description', () => {
      it('should use the default template', () => {
        class DefaultTemplate {
          @ApiException(BadRequestException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
        expect(spy).toBeCalled();
      });
    });

    describe('given valid NestJS built in exception (forbidden exception) without template or description', () => {
      it('should use the default template including the error property', () => {
        class DefaultTemplateWithError {
          @ApiException(ForbiddenException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
        expect(spy).toBeCalled();
      });
    });

    describe('given valid NestJS built in exception without template but with description', () => {
      it('should use the default template', () => {
        class DefaultTemplateWithDescription {
          @ApiException(BadRequestException, { description: 'This is a test' })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
        expect(spy).toBeCalled();
      });
    });
  });

  describe('@TemplatedApiException', () => {
    describe('given single exception', () => {
      it('should use the default template', () => {
        class TemplatedApiExceptionTest {
          @TemplatedApiException(BadRequestException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
        expect(spy).toBeCalled();
      });

      it('should not print a warning anymore because of duplicate class name', () => {
        class TemplatedApiExceptionTest {
          @TemplatedApiException(BadRequestException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
        expect(spy).toBeCalledTimes(0);
      });
    });

    describe('given exception array', () => {
      it('should use the default template', () => {
        class TemplatedApiExceptionWithArrayTest {
          @TemplatedApiException([BadRequestException, NotFoundException])
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
        expect(spy).toBeCalled();
      });
    });
  });
});
