import { HttpException } from '@nestjs/common';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { Options } from '../interfaces/options.interface';
import { merge } from './example.util';
import { buildSchema } from './schema.util';

const PlaceholderExceptionMapping = {
  $status: 'getStatus',
  $description: 'message',
};

const resolvePlaceholders = (template: any, exception: HttpException) => {
  for (const key of Object.keys(template)) {
    const placeholderProperty = PlaceholderExceptionMapping[template[key]];
    if (placeholderProperty) {
      if (typeof exception[placeholderProperty] === 'function') {
        template[key] = exception[placeholderProperty]();
      } else {
        template[key] = exception[placeholderProperty];
      }
    }
  }
};

export const resolveTemplatePlaceholders = (template: any, exception: HttpException) => {
  const copy = JSON.parse(JSON.stringify(template));
  resolvePlaceholders(copy, exception);
  return copy;
};

export const buildContentObjects = (exceptions: HttpException[], options: Options) => {
  const contents: Record<number, ContentObject> = {};
  for (const exception of exceptions) {
    const statusCode = exception.getStatus();
    if (!contents[statusCode]) {
      contents[statusCode] = { [options.contentType]: { examples: {} } };
      contents[statusCode][options.contentType].schema = buildSchema(options, exception);
    }

    const content = contents[statusCode];

    const exampleResponse = resolveTemplatePlaceholders(options.template, exception);

    merge(content[options.contentType].examples, {
      [exception.constructor.name]: {
        description: options.description || exception.message,
        value: exampleResponse,
      },
    });
  }

  return contents;
};

export const mergeExampleContent = (content: ContentObject, newContent: ContentObject) => {
  for (const key of Object.keys(newContent)) {
    const { examples } = content[key];
    const { examples: newExamples } = newContent[key];

    merge(examples, newExamples);
  }
};
