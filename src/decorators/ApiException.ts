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
 * @param globalOptions Set a template or specify the content type
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
 * @param exceptionsArg Pass one or more exceptions which should be shown in Swagger API documentation
 * @param options Set a template or specify the content type
 */
export function ApiException<T extends HttpException>(exceptionsArg: ExceptionsArguments<T>, options?: Options) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    let exceptions: Exception<T>[];

    if (Array.isArray(exceptionsArg)) {
      exceptions = exceptionsArg;
    } else {
      exceptions = [exceptionsArg];
    }

    const instances = instantiateExceptions(exceptions);
    if (!checkIfAllExceptionStatusAreEqual(instances)) {
      // tslint:disable-next-line: no-console
      console.warn(
        `@ApiException(): Please inspect exceptions in decorator. Not all statusses are equal! (Class-name: ${target.constructor.name}, Method: ${propertyKey})`,
      );
    }

    const mergedOptions = mergeOptions(options);

    const { content, status } = buildContent(instances, mergedOptions);

    if (descriptor) {
      const existingExamples = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) as Record<
        string,
        ContentObject
      >;

      if (existingExamples) {
        // tslint:disable-next-line: no-console
        console.warn(
          'WARNING: ApiResponse/ApiException has been used already. We need to attach the newly generated example to the existing payload!',
        );

        // console.log({ existing: JSON.stringify(existingExamples) });

        const {
          [status]: { content: existingContent },
        } = existingExamples;

        if (existingContent) {
          // TODO: Append content to existing content
        }
      }
    } else {
      const previous = Reflect.getMetadata(DECORATORS.API_RESPONSE, target);
      // console.log({ previousTarget: previous });
    }

    // Just pass decorator args to ApiResponse... no need to use Reflect here :)
    ApiResponse({
      status,
      content,
    })(target, propertyKey, descriptor);

    if (descriptor) {
      return descriptor;
    }

    return target;
  };
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

function checkIfAllExceptionStatusAreEqual(exceptions: HttpException[]) {
  return new Set(exceptions.map(exception => exception.getStatus())).size === 1;
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
