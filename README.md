# @nanogiants/nestjs-swagger-api-exception-decorator ![Node.js CI](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/workflows/Node.js%20CI/badge.svg?branch=master) ![npm](https://img.shields.io/npm/v/@nanogiants/nestjs-swagger-api-exception-decorator)

https://www.npmjs.com/package/@nanogiants/nestjs-swagger-api-exception-decorator

> NestJS Swagger decorator for API exceptions

## Installation

```sh
$ npm install @nanogiants/nestjs-swagger-api-exception-decorator
```

## Usage

```typescript
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@ApiException(UnauthorizedException)
export class Controller {
  @ApiOperation({ summary: 'Changes the users password' })
  @ApiException([PasswordsDidNotMatchException, OldAndNewPasswordMatchException])
  @ApiException(CredentialsNotValidException)
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

## Documentation

Please visit the documentation page for more examples and information, such as body templates, placeholders etc.

## License

```
The MIT License (MIT)

Copyright 2021 NanoGiants GmbH

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
