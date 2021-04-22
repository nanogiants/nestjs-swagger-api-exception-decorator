import { HttpException } from '@nestjs/common';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { MergedOptions, Template } from '../interfaces/options.interface';
import { merge } from './example.util';
import { buildSchema } from './schema.util';
import { buildMessageByType } from './type.util';

const PlaceholderExceptionMapping = {
  $status: 'getStatus',
  $description: 'message',
};

const resolvePlaceholders = (template: Template, exception: HttpException, options: MergedOptions) => {
  for (const key of Object.keys(template)) {
    if (typeof template[key] === 'string') {
      const placeholderProperty = PlaceholderExceptionMapping[template[key] as string];
      if (placeholderProperty) {
        if (typeof exception[placeholderProperty] === 'function') {
          template[key] = exception[placeholderProperty]();
        } else {
          template[key] = exception[placeholderProperty];
        }
      }
    }
  }

  buildMessageByType(template, options);
};

export const resolveTemplatePlaceholders = (options: MergedOptions, exception: HttpException) => {
  const copy = JSON.parse(JSON.stringify(options.template));
  resolvePlaceholders(copy, exception, options);
  return copy;
};

export const buildContentObjects = (exceptions: HttpException[], options: MergedOptions) => {
  const contents: Record<number, ContentObject> = {};
  for (const exception of exceptions) {
    const statusCode = exception.getStatus();
    if (!contents[statusCode]) {
      contents[statusCode] = { [options.contentType]: { examples: {} } };
      contents[statusCode][options.contentType].schema = buildSchema(options, exception);
    }

    const content = contents[statusCode];

    const exampleResponse = resolveTemplatePlaceholders(options, exception);

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
