// TODO: Remove this file if the deprecated decorator signature has been removed

/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApiOperationOptions, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

import { ApiException } from '../../lib';

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

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
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

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
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

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });
});
