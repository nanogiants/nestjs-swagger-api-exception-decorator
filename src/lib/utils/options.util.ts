import { MergedOptions, Options } from '../interfaces/options.interface';

const DefaultOptions: Options = {
  contentType: 'application/json',
  template: {
    statusCode: '$status',
    message: '$description',
    error: '$error',
  },
};

export const DefaultTemplateRequiredProperties = ['statusCode', 'message'];

export const mergeOptions = (options?: Options): MergedOptions => {
  // If `null` is specified as template, we need to remove it to apply the default template
  if (options?.template === null) {
    delete options.template;
  }

  const mergedOptions: MergedOptions = { ...DefaultOptions, ...options };

  if (options) {
    // Needed because we need to determine later if the used template is the default template or a user defined template
    mergedOptions.userDefinedTemplate = !!options.template;
  }

  return mergedOptions;
};
