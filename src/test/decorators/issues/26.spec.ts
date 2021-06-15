import { InternalServerErrorException } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { ApiException } from '../../../lib';

class EmailResponseFailedException extends InternalServerErrorException {
  constructor() {
    super('Email Response Failed');
  }
}

class InternalServerException extends InternalServerErrorException {
  constructor() {
    super('Something went wrong');
  }
}

describe('Issue #26', () => {
  describe('given InternalServerError exception and custom exception sharing the same status code', () => {
    it('should attach the exceptions properly without missing another', () => {
      class InternalServerError {
        @ApiException(() => [EmailResponseFailedException, InternalServerException])
        test() {
          return;
        }
      }

      const descriptor = Object.getOwnPropertyDescriptor(InternalServerError.prototype, 'test');
      const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

      expect(meta).toMatchSnapshot();
    });
  });
});
