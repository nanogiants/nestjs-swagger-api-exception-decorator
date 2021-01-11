---
id: introduction
title: Introduction
slug: /
---

NestJS Swagger decorator for specifying API exceptions.

This is a wrapper for `@ApiResponse()` which uses `message` and `status` inside NestJS `HttpException` as description and HTTP status code in the Swagger documentation. You can pass any subclass of `HttpException` to the decorator. This decorator is especially useful if you want to define multiple custom exceptions per status code.
