import { getTypeIsArrayTuple } from '@nestjs/swagger/dist/decorators/helpers';

import { MergedOptions } from '../interfaces/options.interface';

export const buildMessageByType = (template: any, options: MergedOptions) => {
  if (!options.userDefinedTemplate && options.type) {
    if (typeof options.type() === 'function') {
      const [type, isArray] = getTypeIsArrayTuple(options.type, !!options.isArray);
      const instantiated = new (type())();

      console.log({
        original: options.type(),
        type: type(),
        instantiated,
        keys: Object.keys(instantiated),
        prot: Object.getPrototypeOf(instantiated),
      });

      // eslint-disable-next-line @typescript-eslint/ban-types
      const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(new (type())()));
      console.log({ keys });

      for (const key of Object.getOwnPropertyNames(type().prototype)) {
        console.log(key);
      }

      console.log({ type: type(), isArray });
    } else {
      return options.type();
    }
  }
};
