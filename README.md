# nestjs-swagger-api-exception-decorator

![Node.js CI](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/workflows/Node.js%20CI/badge.svg?branch=master)

NestJS Swagger decorator for specifying API exceptions. This is a wrapper for `@ApiResponse(...)` which uses `message` and `status` inside NestJS `HttpException` as description and HTTP status code in the Swagger documentation. You can pass any subclass of `HttpException` to the decorator.

# Installation

```bash
npm i nestjs-swagger-api-exception-decorator
```

# Usage

TypeScript:

```typescript
import { ApiException } from 'nestjs-swagger-api-exception-decorator';
```

You may use NestJS built in exceptions:

```typescript
@ApiOperation({ summary: 'Creates JWT for an existing user' })
@ApiCreatedResponse({ description: 'The access and refresh JWT', type: UserLoginResponse })
@ApiException(UnauthorizedException, { description: 'The login credentials were invalid' })
@ApiException(BadRequestException, { description: 'Required parameter was missing' })
@Post('/')
authenticateUser(@Body() user: UserLoginDto): Promise<UserLoginResponse> {
    return this.authService.login(user);
}
```

## Custom exceptions

You may also use your own exceptions (which are subclassed from `HttpException`):

```typescript
export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User was not found');
  }
}
```

```typescript
@ApiException(UserNotFoundException)
@Post('/')
authenticateUser(@Body() user: UserLoginDto): Promise<UserLoginResponse> {
    return this.authService.login(user);
}
```

Prints the 404 status code (coming from `NotFoundException` - which extends `HttpException`) and the message `User was not found` in the endpoints response documentation.

# License

```
The MIT License (MIT)

Copyright 2020 NanoGiants GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
