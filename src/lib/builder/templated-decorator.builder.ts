import { HttpException, Type } from '@nestjs/common';

import { ApiException } from '..';
import { ExceptionOrExceptionArrayFunc } from '../interfaces/api-exception.interface';
import { Options, Template } from '../interfaces/options.interface';

/**
 * Build your own custom decorator. This enables you to re-use the same template again without the need to specify it
 * over and over again
 *
 * @param template Any object describing the template which should be shown as example value
 * @param globalOptions Specify the content type
 */
export const buildTemplatedApiExceptionDecorator = <T = Template>(
  template: T | (() => Type<unknown>),
  globalOptions?: Omit<Options<T>, 'template'>,
) => {
  return <Exception extends HttpException>(
    exceptions: ExceptionOrExceptionArrayFunc<Exception>,
    options?: Options<T>,
  ) => {
    const mergedOptions = { ...globalOptions, template, ...options } as unknown as Options<Template>;
    return ApiException(exceptions as ExceptionOrExceptionArrayFunc<Exception>, mergedOptions);
  };
};
