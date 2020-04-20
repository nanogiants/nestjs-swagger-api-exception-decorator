import { HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export type Newable<T> = new () => T;

export interface ExceptionOptions {
  description?: string;
}

export const ApiException = <T extends HttpException>(
  exception: Newable<T>,
  options?: ExceptionOptions,
): MethodDecorator & ClassDecorator => {
  const instance = new exception();

  return ApiResponse({
    status: instance.getStatus(),
    description: options?.description || instance.message,
  });
};
