---
title: Templated exceptions
---

Additionally you may be using NestJS exception filters. Using the template configuration or templated `@ApiException` decorator allows you to define a (reusable) template which should be shown in SwaggerUI.

There are two ways of defining a template:

1. Specify a template each time you're using the decorator
2. Use the `buildTemplatedApiExceptionDecorator()` function to generate a reusable decorator

## Use the configuration object

When using the `@ApiException` decorator you can additionally pass a object. In previous sections you may have seen, that you can specify a `description`. Additionally you can pass a `template` which then will be used to display the example response in SwaggerUI. For example:

```typescript
@ApiException(BadRequestException, { template: {
  statusCode: '$status',
  timestamp: '01.01.1970T15:30:11',
  path: 'string',
  message: '$description',
  reasons: 'string',
}})
```

Please keep in mind, that the specified template will **only** be used for this decorator and not for other documented `@ApiException` decorators and therefore has to be defined in each `@ApiException` decorator. If you want to re-use the template for all `@ApiException` decorators, we recommend using the builder function.

## Use the builder function

Generate a custom `@TemplatedApiException` decorator with the `buildTemplatedApiExceptionDecorator` function and pass a template which matches your needs or your generic NestJS exception filters response body. For example:

```typescript
// templated-api-exception.ts

import { buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  timestamp: '01.01.1970T15:30:11',
  path: 'string',
  message: '$description',
  reasons: 'string',
});
```

Then just decorate your routes just like you would do with the `@ApiException` decorator. For example:

```typescript
import { TemplatedApiException } from './templated-api-exception';

import { UserNotAuthorizedException } from './unauthorized-exceptions';
import { PasswordInvalidException } from './bad-request-exceptions';

export class UserController {
  @ApiOperation({ summary: 'Changes the users password' })
  @TemplatedApiException(PasswordInvalidException)
  @TemplatedApiException(UserNotAuthorizedException)
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```
