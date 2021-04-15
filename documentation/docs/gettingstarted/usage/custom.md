---
title: Custom exceptions
---

When using the decorator with custom exceptions, this decorator gets much more useful than just using the decorator with NestJS built-in exceptions.

## Why custom exceptions?

Assuming you're already using custom exceptions in your NestJS backend. For example:

```typescript
// bad-request-exceptions.ts

import { BadRequestException } from '@nestjs/common';

export class PasswordInvalidException extends BadRequestException {
  constructor() {
    super('The password was invalid');
  }
}
```

```typescript
// unauthorized-exceptions.ts

import { UnauthorizedException } from '@nestjs/common';

export class UserNotAuthorizedException extends UnauthorizedException {
  constructor() {
    super('The user is not authorized');
  }
}
```

_Remember that all NestJS exceptions extend `HttpException` which contain a description and the HTTP status code._

The advantages of using custom exceptions are:

- Re-use the custom exception in multiple services and controllers
- The description needs to be written once
- Just `throw new UserNotAuthorizedException();`. There is no need to `throw new UnauthorizedException('The user is not authorized');` over and over again
  - Much more convenient when using auto-completion / IntelliSense
- Compatible with `@ApiException` decorator 🤩

## Route methods

Simply import the decorator in your controller where you want to document the API exceptions:

```typescript
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
```

Then start decorating the controller routes where the API exceptions should be shown in the API documentation. For example:

```typescript
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { UserNotAuthorizedException } from './unauthorized-exceptions';
import { PasswordInvalidException } from './bad-request-exceptions';

export class UserController {
  @ApiOperation({ summary: 'Changes the users password' })
  @ApiException(() => [PasswordInvalidException, UserNotAuthorizedException])
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

The decorator then takes the exception descriptions and passes them to Swagger. No need to pass an object containing a description here!

### Overwrite the description

If you pass an object containing the description, the description will be overwritten by the description you defined.

```typescript
@ApiException(() => PasswordInvalidException, { description: 'Any other description' })
```

### Pass exceptions as an array

You can also pass an array of exceptions to the decorator. For example:

```typescript
// bad-request-exceptions.ts

import { BadRequestException } from '@nestjs/common';

export class PasswordInvalidException extends BadRequestException {
  constructor() {
    super('The password was invalid');
  }
}

export class PasswordNotMatchingRequirementsException extends BadRequestException {
  constructor() {
    super('The password does not match the requirements');
  }
}
```

```typescript
@ApiException(() => [PasswordInvalidException, PasswordNotMatchingRequirementsException])
```

:::tip
This allows to pass multiple exceptions with different status codes. The decorator determines which HTTP status code is specified in the exceptions and attaches the exceptions automatically to the correct example values.
:::

## At class level

:::caution
Decorators at class level will **only** be applied to controller routes which are decorated by `@ApiOperation` decorator!
:::
