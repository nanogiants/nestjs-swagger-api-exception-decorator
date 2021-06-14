import { HttpException, Type } from '@nestjs/common';

import { Placeholder } from '../interfaces/options.interface';

/**
 * Build your own custom placeholder by passing a custom exception and a resolver function
 *
 * @param exception () => ? extends HttpException
 * @param resolver: (exception: ? extends HttpException) => exception.yourCustomFunction();
 */
export const buildPlaceholder = <T extends HttpException>(
  exception: () => Type<T>,
  resolver: (exception: T) => any,
): Placeholder => {
  return {
    exceptionMatcher: exception,
    resolver,
  };
};
