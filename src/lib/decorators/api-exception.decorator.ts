import { HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ExceptionOrExceptionArrayFunc } from '../interfaces/api-exception.interface';
import { Options } from '../interfaces/options.interface';
import { applyClassDecorator, getApiResponseContent } from '../utils/decorator.util';
import { buildContentObjects, mergeExampleContent } from '../utils/example-content.util';
import { instantiateExceptions } from '../utils/exception.util';
import { mergeOptions } from '../utils/options.util';
import { resolveTypeTemplate } from '../utils/type.util';

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
): ClassDecorator & MethodDecorator {
  resolveTypeTemplate(options);

  const mergedOptions = mergeOptions(options);
  const instances = instantiateExceptions(exceptions);
  const newContents = buildContentObjects(instances, mergedOptions);

  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      const content = getApiResponseContent(descriptor);

      for (const [statusCode, newContent] of Object.entries(newContents)) {
        if (content?.[statusCode]) {
          const existingContent = content[statusCode].content;
          mergeExampleContent(existingContent, newContent);
        } else {
          ApiResponse({ status: parseInt(statusCode), content: newContents[statusCode] })(
            target,
            propertyKey,
            descriptor,
          );
        }
      }
    } else {
      applyClassDecorator(target, exceptions, options);
    }

    return descriptor ? descriptor : target;
  };
}
