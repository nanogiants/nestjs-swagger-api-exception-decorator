import { HttpException } from '@nestjs/common';

import { ExceptionArguments } from '../interfaces/exceptions.interface';

export const instantiateExceptions = (exceptions: ExceptionArguments<HttpException>) => {
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
      `@ApiException(): Please inspect exceptions in decorator. Not all statusses are equal! (Class-name: ${target.constructor.name}, Method: ${propertyKey})`,
    );
  }
};
