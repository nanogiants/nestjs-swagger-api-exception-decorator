import { HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ExceptionArguments } from '../interfaces/exceptions.interface';
import { Options } from '../interfaces/options.interface';
import { applyClassDecorator, getApiResponseContent } from '../utils/decorator.util';
import { buildContentObject, mergeExampleContent } from '../utils/example-content.util';
import { instantiateExceptions, printWarningIfStatusCodesDoNotMatch } from '../utils/exception.util';
import { mergeOptions } from '../utils/options.util';

/**
 * This shows exceptions with status code, description and grouped with example values. If there are multiple exceptions
 * per status codes, all matching exceptions will be grouped and shown as examples.
 *
 * When using as class decorator, the exceptions will be attached to all methods which have a @ApiOperation decorator.
 *
 * @param exceptions Pass one or more exceptions which should be shown in Swagger API documentation
 * @param options Set a template or specify the content type
 */
export const ApiException = <T extends HttpException>(exceptions: ExceptionArguments<T>, options?: Options) => {
  const mergedOptions = mergeOptions(options);
  const instances = instantiateExceptions(exceptions);
  const contentObject = buildContentObject(instances, mergedOptions);
  const statusCode = instances[0].getStatus();

  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    printWarningIfStatusCodesDoNotMatch(instances, target, propertyKey);

    const content = getApiResponseContent(target, descriptor);
    if (content?.[statusCode]) {
      const existingContent = content[statusCode].content;
      mergeExampleContent(existingContent, contentObject);
    } else {
      if (descriptor) {
        ApiResponse({ status: statusCode, content: contentObject })(target, propertyKey, descriptor);
      } else {
        applyClassDecorator(target, exceptions, options);
      }
    }

    return descriptor ? descriptor : target;
  };
};
