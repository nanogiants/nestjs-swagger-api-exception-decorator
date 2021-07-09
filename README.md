# NestJS Swagger API Exception Decorator

[![Node.js CI](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/workflows/Node.js%20CI)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nanogiants_nestjs-swagger-api-exception-decorator&metric=alert_status)](https://sonarcloud.io/dashboard?id=nanogiants_nestjs-swagger-api-exception-decorator)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nanogiants_nestjs-swagger-api-exception-decorator&metric=coverage)](https://sonarcloud.io/dashboard?id=nanogiants_nestjs-swagger-api-exception-decorator)
[![npm](https://img.shields.io/npm/v/@nanogiants/nestjs-swagger-api-exception-decorator)](https://www.npmjs.com/package/@nanogiants/nestjs-swagger-api-exception-decorator)
[![npm downloads](https://img.shields.io/npm/dw/@nanogiants/nestjs-swagger-api-exception-decorator)](https://www.npmjs.com/package/@nanogiants/nestjs-swagger-api-exception-decorator)

## Description

[NestJS Swagger](https://docs.nestjs.com/openapi/introduction) decorator for API exceptions.

## Installation

```sh
$ npm i @nanogiants/nestjs-swagger-api-exception-decorator
```

## Example

```typescript
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@ApiException(() => UnauthorizedException)
export class Controller {
  @ApiOperation({ summary: 'Changes the users password' })
  @ApiException(() => [PasswordsDidNotMatchException, OldAndNewPasswordMatchException, CredentialsNotValidException])
  @Patch('/password')
  async changeUserPassword(@Res() res: Response): Promise<void> {
    return res.sendStatus(HttpStatus.OK);
  }
}
```

## Getting Started

Please visit our [documentation](https://nanogiants.github.io/nestjs-swagger-api-exception-decorator/) to get started.

## Release Notes

Please visit the [Release Notes](https://nanogiants.github.io/nestjs-swagger-api-exception-decorator/releasenotes/v1.4.0) in our documentation for major and minor releases. Patch releases are documentated in [GitHub Releases](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/releases).
