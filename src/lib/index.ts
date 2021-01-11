import { HttpException } from '@nestjs/common';

import { ApiException } from './decorators/api-exception.decorator';
import { ExceptionArguments } from './interfaces/exceptions.interface';
import { Options } from './interfaces/options.interface';

/**
 * Build your own custom decorator. This enables you to re-use the same template again without the need to specify it
 * over and over again
 *
 * @param template Any object describing the template which should be shown as example value
 * @param globalOptions Specify the content type
 */
export const buildTemplatedApiExceptionDecorator = (template: unknown, globalOptions?: Omit<Options, 'template'>) => {
  const decoratorBuilder = <T extends HttpException>(exceptions: ExceptionArguments<T>, options?: Options) => {
    return ApiException(exceptions, {
      ...globalOptions,
      template,
      ...options,
    });
  };

  return decoratorBuilder;
};

export { ApiException };
