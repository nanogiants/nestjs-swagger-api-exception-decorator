import { Exception, ExceptionsArguments } from 'interfaces/Exceptions';

import { HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExampleObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function buildTemplatedApiExceptionDecorator(template: any) {
  function decoratorBuilder<T extends HttpException>(exceptions: ExceptionsArguments<T>) {
    return ApiException(exceptions, template);
  }

  return decoratorBuilder;
}

export function ApiException<T extends HttpException>(exceptionsArg: ExceptionsArguments<T>, template?: any) {
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

    const { content, status } = buildContent(instances, template);

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

function buildContent(exceptions: HttpException[], template?: any) {
  const status = exceptions[0].getStatus();

  const examples: Record<string, ExampleObject | ReferenceObject> = {};
  const content = { 'application/json': { examples } };

  for (const instance of exceptions) {
    let copy: any;
    if (template && typeof template === 'object') {
      copy = { ...template };
      for (const key of Object.keys(copy)) {
        if (copy[key] === '$status') {
          copy[key] = instance.getStatus();
        } else if (copy[key] === '$description') {
          copy[key] = instance.message;
        }
      }
    }

    examples[instance.constructor.name] = {
      description: instance.message,
      value: copy,
    };
  }

  return { content, status };
}
