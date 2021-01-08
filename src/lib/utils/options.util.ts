import { Options } from '../interfaces/options.interface';

const DefaultOptions: Options = {
  contentType: 'application/json',
  template: undefined,
  description: undefined,
};

export const mergeOptions = (options: Options) => {
  return { ...DefaultOptions, ...options };
};
