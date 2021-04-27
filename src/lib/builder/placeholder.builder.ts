import { HttpException, Type } from '@nestjs/common';

/**
 * Build your own custom placeholder by passing a custom exception and a resolver function
 *
 * @param exception () => ? extends HttpException
 * @param resolver: (exception: ? extends HttpException) => exception.yourCustomFunction();
 */
export const buildPlaceholder = <T extends HttpException>(
  exception: () => Type<T>,
  resolver: (exception: T) => any,
) => {
  return {
    exceptionMatcher: exception,
    resolver,
  };
};
