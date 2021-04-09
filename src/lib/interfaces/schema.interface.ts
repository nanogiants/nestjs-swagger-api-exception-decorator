import { HttpException } from '@nestjs/common';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { MergedOptions } from './options.interface';

export interface SchemaOptions {
  content: ContentObject;
  options: MergedOptions;
  exception: HttpException;
}
