import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(response: string | Record<string, any>, status: number, private clientCode: number) {
    super(response, status);
  }

  getClientCode() {
    return this.clientCode;
  }
}

export class UserUnauthorizedException extends BaseException {
  constructor() {
    super('User is not authorized', HttpStatus.UNAUTHORIZED, 1000);
  }
}
