---
id: introduction
title: Introduction
slug: /
---

[NestJS Swagger](https://docs.nestjs.com/openapi/introduction) decorator for API exceptions.

This decorator is a wrapper for [`ApiResponse`](https://github.com/nestjs/swagger/blob/master/lib/decorators/api-response.decorator.ts) decorator. It uses message, error and status of all given `HttpException` and generates the correct responses in the [OpenAPI](https://swagger.io/specification/) Swagger documentation based on them. This decorator is especially useful when used with custom exceptions.
