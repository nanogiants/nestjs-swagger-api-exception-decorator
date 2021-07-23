---
title: Templated exceptions
---

Additionally you may be using NestJS exception filters. Using the template configuration or templated `@ApiException` decorator allows you to define a (reusable) template which should be shown in SwaggerUI.

There are two ways of defining a template:

1. Specify a template each time you're using the decorator
2. Use the `buildTemplatedApiExceptionDecorator()` function to generate a reusable decorator

## The configuration object

The `ApiException` decorator additionally accepts an object. In addition to the description it is possible to pass a [`template`](/api#template). This is used to display the sample response in Swagger-UI. For example:

```typescript
@ApiException(() => BadRequestException, {
  template: {
    statusCode: '$status',
    timestamp: '01.01.1970T15:30:11',
    path: 'string',
    message: '$description',
    reasons: 'string',
  }
})
```

:::note
Please keep in mind, that the specified template will **only** be used for this decorator and not for other documented `@ApiException` decorators and therefore has to be defined in each `@ApiException` decorator. If you want to re-use the template for all `@ApiException` decorators, we recommend using the builder function.
:::

## The builder function

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
  @TemplatedApiException(() => [PasswordInvalidException, UserNotAuthorizedException])
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

### Configuration

You may configure your `TemplatedApiException` decorator with the arguments:

```typescript
buildTemplatedApiExceptionDecorator(template: Template, options: Omit<Options, 'template'>)
```

1. [`template`](/api#template): pass any template object (may include any [built-in](/api#placeholder) or [custom](/api#placeholders) placeholder)
2. [`options`](/api#overview): excluding the previously specified `template`
