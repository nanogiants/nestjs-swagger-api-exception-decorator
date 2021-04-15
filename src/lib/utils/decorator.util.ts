import { HttpException } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { ApiException } from '../decorators/api-exception.decorator';
import { ExceptionOrExceptionArray } from '../interfaces/api-exception.interface';
import { MetaContent } from '../interfaces/api-response.interface';
import { Options } from '../interfaces/options.interface';

export const getApiResponseContent = (target?: any, descriptor?: PropertyDescriptor): Record<string, MetaContent> => {
  if (descriptor) {
    return Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);
  }

  return Reflect.getMetadata(DECORATORS.API_RESPONSE, target);
};

export const applyClassDecorator = <T extends HttpException>(
  target: () => void,
  exceptions: ExceptionOrExceptionArray<T>,
  options?: Options,
) => {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    const metadata = Reflect.getMetadata(DECORATORS.API_OPERATION, methodDescriptor.value);
    if (metadata) {
      const decorator = ApiException(() => exceptions, options);
      decorator(target, key, methodDescriptor);
    }
  }
};
