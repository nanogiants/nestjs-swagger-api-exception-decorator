import { Options } from '../interfaces/options.interface';

const DefaultOptions: Options = {
  contentType: 'application/json',
  template: {
    statusCode: '$status',
    message: '$description',
    error: '$description',
  },
  description: undefined,
};

export const mergeOptions = (options: Options) => {
  return { ...DefaultOptions, ...options };
};
