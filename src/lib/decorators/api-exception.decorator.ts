import { HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import {
  ExceptionArguments,
  ExceptionOrExceptionArray,
  ExceptionOrExceptionArrayFunc,
} from '../interfaces/api-exception.interface';
import { Options } from '../interfaces/options.interface';
import { applyClassDecorator, getApiResponseContent } from '../utils/decorator.util';
import { buildContentObject, mergeExampleContent } from '../utils/example-content.util';
import {
  areExceptionsPassedWithoutArrowFunction,
  instantiateExceptions,
  printWarningIfStatusCodesDoNotMatch,
  printWarningIfUsingDeprecatedSignature,
} from '../utils/exception.util';
import { mergeOptions } from '../utils/options.util';

type Decorator = ClassDecorator & MethodDecorator;

/**
 * This shows exceptions with status code, description and grouped with example values. If there are multiple exceptions
 * per status codes, all matching exceptions will be grouped and shown as examples.
 *
 * When using as class decorator, the exceptions will be attached to all methods which have a @ApiOperation decorator.
 *
 * @param exceptions Pass one or more exceptions with a arrow function which should be shown in Swagger API documentation
 * @param options Set a template or specify the content type
 */
export function ApiException<T extends HttpException>(
  exceptions: ExceptionOrExceptionArrayFunc<T>,
  options?: Options,
): Decorator;

/**
 * @deprecated This decorator signature will be removed in future versions. Please provide HttpExceptions as function:
 *
 * \@ApiException(() => BadRequestException, [options])
 */
export function ApiException<T extends HttpException>(
  exceptions: ExceptionOrExceptionArray<T>,
  options?: Options,
): Decorator;
export function ApiException<T extends HttpException>(exceptions: ExceptionArguments<T>, options?: Options): Decorator {
  let passedExceptions: ExceptionOrExceptionArray<T>;
  if (areExceptionsPassedWithoutArrowFunction(exceptions)) {
    passedExceptions = exceptions as ExceptionOrExceptionArray<T>;
  } else {
    passedExceptions = (exceptions as ExceptionOrExceptionArrayFunc<T>)();
  }

  const mergedOptions = mergeOptions(options);
  const instances = instantiateExceptions(passedExceptions);
  const contentObject = buildContentObject(instances, mergedOptions);
  const statusCode = instances[0].getStatus();

  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    printWarningIfStatusCodesDoNotMatch(instances, target, propertyKey);
    printWarningIfUsingDeprecatedSignature(exceptions, target, propertyKey);

    const content = getApiResponseContent(target, descriptor);
    if (content?.[statusCode]) {
      const existingContent = content[statusCode].content;
      mergeExampleContent(existingContent, contentObject);
    } else {
      if (descriptor) {
        ApiResponse({ status: statusCode, content: contentObject })(target, propertyKey, descriptor);
      } else {
        applyClassDecorator(target, passedExceptions, options);
      }
    }

    return descriptor ? descriptor : target;
  };
}
