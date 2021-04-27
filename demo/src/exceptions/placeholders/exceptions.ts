import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    response: string | Record<string, any>,
    status: number,
    private clientCode: number,
  ) {
    super(response, status);
  }

  getClientCode() {
    return this.clientCode;
  }
}

export class UserUnauthorizedException extends BaseException {
  constructor() {
    const body = BaseException.createBody(
      'User is not authorized',
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
    );
    super(body, HttpStatus.UNAUTHORIZED, 1000);
  }
}
