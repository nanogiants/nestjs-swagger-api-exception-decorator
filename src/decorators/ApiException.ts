import { MetaContent } from 'interfaces/ApiResponse';

import { HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { ContentObject, ExampleObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { Exception, ExceptionsArguments } from '../interfaces/Exceptions';
import { Options } from '../interfaces/Options';

/**
 * Build your own custom decorator. This enables you to re-use the same template again without the need to specify it
 * over and over again
 *
 * @param template Any object describing the template which should be shown as example value
 * @param globalOptions Specify the content type
 */
export function buildTemplatedApiExceptionDecorator(template: any, globalOptions?: Omit<Options, 'template'>) {
  function decoratorBuilder<T extends HttpException>(exceptions: ExceptionsArguments<T>, options?: Options) {
    return ApiException(exceptions, {
      ...globalOptions,
      template,
      ...options,
    });
  }

  return decoratorBuilder;
}

/**
 * This shows exceptions with status code, description and grouped with example values. If there are multiple exceptions
 * per status codes, all matching exceptions will be grouped and shown as examples.
 *
 * When using as class decorator, the exceptions will be attached to all methods which have a @ApiOperation decorator.
 *
 * @param exceptionsArg Pass one or more exceptions which should be shown in Swagger API documentation
 * @param options Set a template or specify the content type
 */
export function ApiException<T extends HttpException>(exceptionsArg: ExceptionsArguments<T>, options?: Options) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    const exceptions: Exception<T>[] = Array.isArray(exceptionsArg) ? exceptionsArg : [exceptionsArg];
    const instances = instantiateExceptions(exceptions);
    printWarningIfStatusCodesDoNotMatch(instances, target, propertyKey);

    const mergedOptions = mergeOptions(options);
    const { content, status } = buildContent(instances, mergedOptions);

    const existingContent = getExistingContent(target, descriptor);
    if (existingContent?.[status]) {
      const {
        [status]: { content: existing },
      } = existingContent;

      mergeContent(existing, content);
    } else {
      if (descriptor) {
        ApiResponse({ status, content })(target, propertyKey, descriptor);
      } else if (target) {
        applyClassDecoratorToAllMethods(target, exceptionsArg, options);
      }
    }

    return descriptor ? descriptor : target;
  };
}

function mergeContent(existing: ContentObject, newContent: ContentObject) {
  for (const key of Object.keys(newContent)) {
    if (existing[key]) {
      const { examples } = existing[key];
      const { examples: newExamples } = newContent[key];

      for (const newExampleKey of Object.keys(newExamples)) {
        const existingExampleKeys = Object.keys(examples);
        const matchingExampleKeys = existingExampleKeys.filter(
          eKey => eKey.startsWith(`${newExampleKey} #`) || eKey === newExampleKey,
        );

        if (matchingExampleKeys.length) {
          let startingNumber = matchingExampleKeys.reduce((acc, val) => {
            const SEPARATOR = ' #';
            const indexOfNo = val.lastIndexOf(SEPARATOR);

            if (indexOfNo >= 0) {
              const number = parseInt(val.substring(indexOfNo + SEPARATOR.length), 10);
              if (number > acc) {
                return number;
              }
            }

            return acc;
          }, 0);

          if (startingNumber === 0) {
            examples[`${newExampleKey} #${++startingNumber}`] = examples[newExampleKey];
            delete examples[newExampleKey];
          }

          examples[`${newExampleKey} #${++startingNumber}`] = newExamples[newExampleKey];
        } else {
          examples[newExampleKey] = newExamples[newExampleKey];
        }
      }
    } else {
      existing[key] = newContent[key];
    }
  }
}

function applyClassDecoratorToAllMethods<T extends HttpException>(
  target: any,
  exceptionsArg: ExceptionsArguments<T>,
  options?: Options,
) {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    if (methodDescriptor) {
      const metadata = Reflect.getMetadata(DECORATORS.API_OPERATION, methodDescriptor.value);
      if (metadata) {
        ApiException(exceptionsArg, options)(target, key, methodDescriptor);
      }
    }
  }
}

function getExistingContent(target?: any, descriptor?: PropertyDescriptor): Record<string, MetaContent> {
  if (descriptor) {
    return Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);
  } else if (target) {
    return Reflect.getMetadata(DECORATORS.API_RESPONSE, target);
  }
}

function instantiateExceptions(exceptionsArgs: Exception<HttpException>[]) {
  return exceptionsArgs.map(exception => {
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
}

function printWarningIfStatusCodesDoNotMatch(exceptions: HttpException[], target: any, propertyKey: string) {
  if (new Set(exceptions.map(exception => exception.getStatus())).size !== 1) {
    // tslint:disable-next-line: no-console
    console.warn(
      `@ApiException(): Please inspect exceptions in decorator. Not all statusses are equal! (Class-name: ${target.constructor.name}, Method: ${propertyKey})`,
    );
  }
}

function buildContent(exceptions: HttpException[], options: Options) {
  const status = exceptions[0].getStatus();

  const examples: Record<string, ExampleObject | ReferenceObject> = {};
  const content = { [options.contentType]: { examples } };

  for (const instance of exceptions) {
    let copy: any;
    if (options.template && typeof options.template === 'object') {
      copy = { ...options.template };
      for (const key of Object.keys(copy)) {
        if (copy[key] === '$status') {
          copy[key] = instance.getStatus();
        } else if (copy[key] === '$description') {
          copy[key] = instance.message;
        }
      }
    }

    const exampleName = instance.constructor.name;

    if (examples[exampleName]) {
      const existingDescription = examples[exampleName] as ExampleObject;
      examples[exampleName] = {
        description: `${existingDescription.description} | ${options.description || instance.message}`,
      };
    } else {
      examples[exampleName] = {
        description: options.description || instance.message,
        value: copy,
      };
    }
  }

  return { content, status };
}

function mergeOptions(options: Options) {
  return Object.assign(
    {
      contentType: 'application/json',
      template: undefined,
      description: undefined,
    } as Options,
    options,
  );
}
