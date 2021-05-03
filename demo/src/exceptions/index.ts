import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
export class EmailResponseFailedException extends InternalServerErrorException {
  constructor() {
    super('Email Response Failed');
  }
}

export class InternalServerException extends InternalServerErrorException {
  constructor() {
    super('Something went wrong');
  }
}
