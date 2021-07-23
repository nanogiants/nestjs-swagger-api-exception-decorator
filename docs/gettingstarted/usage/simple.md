---
title: Built-in exceptions
---

## Route methods

Simply import the decorator in your controller where you want to document the API exceptions:

```typescript
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
```

Then start decorating the controller routes where the API exceptions should be shown in the Swagger-UI. For example:

```typescript
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export class UserController {
  @ApiOperation({ summary: 'Changes the users password' })
  @ApiException(() => BadRequestException, { description: 'The password was invalid' })
  @ApiException(() => UnauthorizedException, { description: 'The user is not authorized' })
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

## Class wide

You can also decorate classes with the `@ApiException` decorator. For example:

```typescript
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@ApiException(() => UnauthorizedException, { description: 'The user is not authorized' })
export class UserController {
  @ApiOperation({ summary: 'Retrieves user information' })
  @ApiException(() => NotFoundException, { description: 'The user was not found' })
  @Get('/')
  async getUserInfo(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({ summary: 'Changes the users password' })
  @ApiException(() => BadRequestException, { description: 'The password was invalid' })
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }

  // @ApiException decorator will not be applied to this method!
  @Get()
  doSomething(@Res() res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

Now the `UnauthorizedException` will be applied to all routes inside the `UserController` class.

:::caution
Decorators at class level will **only** be applied to controller routes which are decorated by `@ApiOperation` decorator!
:::

## Grouping

If your route could throw multiple `BadRequestException` instances, you may want to describe all exception cases which could occur. For example:

```typescript
import { BadRequestException } from '@nestjs/common';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export class UserController {
  @ApiOperation({ summary: 'Changes the users password' })
  @ApiException(() => BadRequestException, { description: 'The password was invalid' })
  @ApiException(() => BadRequestException, { description: 'The new password does not match the requirements' })
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

The decorator now shows multiple examples for the same status code including all possible descriptions. In Swagger-UI your exceptions examples will be consecutively numbered.
