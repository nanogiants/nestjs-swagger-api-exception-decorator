import { HttpException } from '@nestjs/common';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { merge } from './example.util';
import { buildSchema } from './schema.util';
import { buildMessageByType } from './type.util';
import { buildPlaceholder } from '../builder/placeholder.builder';
import { MergedOptions, Placeholder, Template } from '../interfaces/options.interface';

const PLACEHOLDER_IDENTIFIER = '$';
const isPlaceholder = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith(PLACEHOLDER_IDENTIFIER);

// This builds a placeholder builder without an exception matcher
const buildGenericPlaceholder = (resolver: (exception: HttpException) => any) => buildPlaceholder(undefined, resolver);

const BuiltinPlaceholders: Record<string, Placeholder> = {
  status: buildGenericPlaceholder(exception => exception.getStatus()),
  description: buildGenericPlaceholder(exception => {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    return response['message'];
  }),
  error: buildGenericPlaceholder(exception => {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    if (response['error']) {
      return response['error'];
    }

    return response['message'];
  }),
};

const resolveBuiltinPlaceholder = (placeholder: string, exception: HttpException) =>
  BuiltinPlaceholders[placeholder]
    ? BuiltinPlaceholders[placeholder].resolver(exception)
    : `${PLACEHOLDER_IDENTIFIER}${placeholder}`;

const resolvePlaceholders = (template: Template, exception: HttpException, options: MergedOptions) => {
  for (const key of Object.keys(template)) {
    const templateValue = template[key];

    if (isPlaceholder(templateValue)) {
      const placeholder = templateValue.substring(1);

      template[key] = resolveBuiltinPlaceholder(placeholder, exception);

      if (options.placeholders?.[placeholder]) {
        const { exceptionMatcher, resolver } = options.placeholders[placeholder];
        if (exception instanceof exceptionMatcher()) {
          template[key] = resolver(exception);
        }
      }

      if (isPlaceholder(template[key])) {
        delete template[key];
      }
    } else if (templateValue !== null && typeof templateValue === 'object') {
      resolvePlaceholders(templateValue as Template, exception, options);
    }
  }
};

export const resolveTemplatePlaceholders = (options: MergedOptions, exception: HttpException) => {
  const copy = JSON.parse(JSON.stringify(options.template));
  buildMessageByType(copy, options);
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
