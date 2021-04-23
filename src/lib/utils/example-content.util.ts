import { HttpException } from '@nestjs/common';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { MergedOptions, Template } from '../interfaces/options.interface';
import { merge } from './example.util';
import { buildSchema } from './schema.util';
import { buildMessageByType } from './type.util';

const PlaceholderExceptionMapping = {
  status: 'getStatus',
  description: 'message',
};

const PLACEHOLDER_IDENTIFIER = '$';

const isString = (value: unknown): value is string => typeof value === 'string';

const resolvePlaceholders = (template: Template, exception: HttpException, options: MergedOptions) => {
  for (const key of Object.keys(template)) {
    let templateValue = template[key];

    const setTemplateValue = (value: unknown) => {
      template[key] = value;
      templateValue = value;
    };

    const deleteTemplateValue = () => {
      delete template[key];
      templateValue = undefined;
    };

    const isPlaceholder = () => isString(templateValue) && templateValue.startsWith(PLACEHOLDER_IDENTIFIER);
    if (isPlaceholder()) {
      const placeholderValue = (templateValue as string).substring(1);

      const placeholderProperty = PlaceholderExceptionMapping[placeholderValue];
      if (placeholderProperty) {
        if (typeof exception[placeholderProperty] === 'function') {
          setTemplateValue(exception[placeholderProperty]());
        } else {
          setTemplateValue(exception[placeholderProperty]);
        }
      }

      if (options.placeholders?.[placeholderValue]) {
        const { exceptionMatcher, resolver } = options.placeholders[placeholderValue];
        if (exception instanceof exceptionMatcher()) {
          setTemplateValue(resolver(exception));
        } else {
          deleteTemplateValue();
        }
      }

      if (isPlaceholder()) {
        deleteTemplateValue();
      }
    } else if (templateValue !== null && typeof templateValue === 'object') {
      resolvePlaceholders(templateValue as Record<string, unknown>, exception, options);
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
