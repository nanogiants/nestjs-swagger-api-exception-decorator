import { HttpException, Type } from '@nestjs/common';

import { ExceptionArguments, ExceptionOrExceptionArray } from '../interfaces/api-exception.interface';

export const instantiateExceptions = (exceptions: ExceptionOrExceptionArray<HttpException>) => {
  return (Array.isArray(exceptions) ? exceptions : [exceptions]).map(exception => {
    if (typeof exception === 'object') {
      return exception;
    }

    try {
      return new exception();
    } catch (error) {
      const name = exception.name;

      const err = new Error(
        `Could not instantiate exception '${name}'. You need to instantiate it yourself with \`new ${name}(possibleArguments)\`!

    `,
      );
      err.stack = error.stack;
      throw err;
    }
  });
};

export const printWarningIfStatusCodesDoNotMatch = (exceptions: HttpException[], target: any, propertyKey: string) => {
  if (new Set(exceptions.map(exception => exception.getStatus())).size !== 1) {
    // eslint-disable-next-line no-console
    console.warn(
      // eslint-disable-next-line max-len
      `@ApiException(): Please inspect exceptions in decorator. Not all status codes are equal! (Class-name: ${target.constructor.name}, Method: ${propertyKey})`,
    );
  }
};

const printedTargets = [];

export const printWarningIfUsingDeprecatedSignature = (
  exceptions: ExceptionArguments<HttpException>,
  target: any,
  propertyKey: string,
) => {
  if (areExceptionsPassedWithoutArrowFunction(exceptions) && propertyKey) {
    const key = `${target.constructor.name}.${propertyKey}`;
    if (!printedTargets.includes(key)) {
      printedTargets.push(key);
      console.warn(`@ApiException: Deprecated decorator signature detected: ${key}`);
    }
  }
};

export const areExceptionsPassedWithoutArrowFunction = <T extends HttpException>(exceptions: ExceptionArguments<T>) =>
  (Array.isArray(exceptions) && (exceptions[0] as Type<T>).prototype instanceof HttpException) ||
  (exceptions as Type<T>).prototype instanceof HttpException ||
  typeof exceptions !== 'function';
