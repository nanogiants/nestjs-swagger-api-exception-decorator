import { InternalServerErrorException } from '@nestjs/common';

import { buildTemplatedApiExceptionDecorator } from '../../../lib';
import { DECORATORS } from '../../../lib/utils/swagger-internals.util';

const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  message: '$message',
  statusCode: '$status',
  errorCode: '$errorCode',
});

class UserAlreadyRegisteredException extends InternalServerErrorException {
  constructor(email: string) {
    super(`${email} already registered`);
  }
}

describe('Issue #33', () => {
  describe('given pre-initialized exception with schema', () => {
    it('should properly use the schema', () => {
      class UserAlreadyRegistered {
        @TemplatedApiException(() => [new UserAlreadyRegisteredException('email@address.com')], {
          enrichSchema: {
            description: 'User already registered',
            externalDocs: {
              url: 'https://someplace.com/doc1',
              description: 'Refer this for more',
            },
          },
        })
        test() {
          return;
        }
      }

      const descriptor = Object.getOwnPropertyDescriptor(UserAlreadyRegistered.prototype, 'test');
      const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

      expect(meta).toMatchSnapshot();
    });
  });
});
