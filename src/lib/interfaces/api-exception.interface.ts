import { HttpException, Type } from '@nestjs/common';

export type Exception<T extends HttpException> = Type<T> | T;
export type ExceptionOrExceptionArrayFunc<T extends HttpException> = () => Exception<T> | Exception<T>[];

export type ExceptionArguments<T extends HttpException> = ExceptionOrExceptionArrayFunc<T>;
