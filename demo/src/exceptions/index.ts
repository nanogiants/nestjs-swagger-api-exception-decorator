import { BadRequestException, NotFoundException } from '@nestjs/common';

export class MissingPropertyException extends BadRequestException {
  constructor() {
    super('Property was missing');
  }
}

export class PayloadMissingException extends BadRequestException {
  constructor() {
    super('Payload is missing');
  }
}
export class CustomNotFoundException extends NotFoundException {
  constructor() {
    super('Payload not found');
  }
}
