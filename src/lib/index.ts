import { HttpException } from '@nestjs/common';

import { ApiException } from './decorators/api-exception.decorator';
import {
  ExceptionArguments,
  ExceptionOrExceptionArray,
  ExceptionOrExceptionArrayFunc,
} from './interfaces/api-exception.interface';
import { Options } from './interfaces/options.interface';
import { areExceptionsPassedWithoutArrowFunction } from './utils/exception.util';

/**
 * Build your own custom decorator. This enables you to re-use the same template again without the need to specify it
 * over and over again
 *
 * @param template Any object describing the template which should be shown as example value
 * @param globalOptions Specify the content type
 */
export const buildTemplatedApiExceptionDecorator = (template: unknown, globalOptions?: Omit<Options, 'template'>) => {
  return <T extends HttpException>(exceptions: ExceptionArguments<T>, options?: Options) => {
    const mergedOptions = { ...globalOptions, template, ...options };

    if (areExceptionsPassedWithoutArrowFunction(exceptions)) {
      return ApiException(exceptions as ExceptionOrExceptionArray<T>, mergedOptions);
    } else {
      return ApiException(exceptions as ExceptionOrExceptionArrayFunc<T>, mergedOptions);
    }
  };
};

export { ApiException };
