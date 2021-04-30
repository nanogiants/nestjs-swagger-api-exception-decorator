---
title: API Description
---

This document covers all additional option properties which may be passed to the decorator.

## Overview

```typescript
{
  template?: Record<string, unknown> | (() => Type<unknown>);
  requiredProperties?: (keyof template)[];
  contentType?: string;
  description?: string;
  schema?: SchemaObject | ReferenceObject;
  type?: () => string | Type<unknown>;
  isArray?: boolean;
  placeholders?: Record<string, Placeholder>;
}
```

## Properties

All properties are optional.

### `template`

*Default*:

```typescript
{
  statusCode: '$status',
  message: '$description',
  error: '$error',
}
```

The template specifies the example value which will be shown in Swagger UI.

#### JSON object

You may pass an `Record` containing key value pairs for your template including the following placeholders:

| Placeholder    | Description                                                                                                                                 | Example              |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------------- |
| `$status`      | Resolved with the status code of the exception                                                                                              | `404`                |
| `$description` | Either resolved with the description passed as option or if no description is specified, the messages of the passed exceptions will be used | `User was not found` |
| `$error`       | The HTTP status code error. Please keep in mind, that if `error` is undefined, `$description` will be used as fallback.                     | `Not Found`          |

You may also specify your own placeholders with the [`placeholders`](#placeholders) property.

#### Swagger annotated class

Additionally you may pass any Swagger annotated class as `template`.

The following `@ApiProperty` properties are used to generate an example value and schema:
* `isArray`
* `example` if `isArray === false`
  * `example` may contain any builtin or custom placeholder as described above
* `examples` if `isArray === true`
  * `examples` may contain any builtin or custom placeholder as described above
* `required`
  * If using any Swagger annotated class together with the [`requiredProperties` option](#requiredproperties), the `requiredProperties` array won't be overwritten.
* `enum`
  * Please keep in mind that the first enum value are used as example value. If you want to override the example value, please use the `example` property

If you need an additional `@ApiProperty` property to be available to generate the example value and schema please [open an issue](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/issues/new) on GitHub.

### `contentType`

*Default*: `application/json`

The content type property specifies the content type in which the example values will be shown.

### `description`

*Default*: `undefined`

The description specifies the example values message and the description shown in Swagger UI.

### `schema`

*Default*: The description passed to the decorator or message of the exception will be shown. See [description](#description).

The schema property can be used to modify the message property only of the example value shown in Swagger UI. It is also possible, to reference to existing schemas using the `ReferenceObject`.

### `type`

*Default*: `undefined`

The type property can be used to specify already defined Swagger annotated classes.

*Example*:
`@ApiException(() => BadRequestException, { type: () => AnySwaggerAnnotatedClass })`

See our [demo project](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/blob/develop/demo/src/app.controller.ts#L70) for a more detailed example.

### `isArray`

*Default*: `undefined`

The isArray property can only be used in combination with the `type` property. It allows you to let the type be shown as array in Swagger UI.

### `requiredProperties`

*Default*: All first-level properties specified in `template`.

The requiredProperties property is used to mark specific properties as required in the generated schema.

### `placeholders`

*Default*: `undefined`

The placeholders property can be used to create custom placeholders. This is useful if you want to use a custom exception template. For example:

```typescript
import { buildPlaceholder, buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';

const TemplatedApiExceptionWithCustomPlaceholder = buildTemplatedApiExceptionDecorator(
  {
    [...]
    clientCode: '$clientCode',
  },
  {
    placeholders: {
      clientCode: {
        exceptionMatcher: () => BaseException,
        resolver: (exception: BaseException) => exception.getClientCode(),
      },
    },
  },
);
```

:::tip
You may either pass the custom exception and resolver directly as in the example above, or use the `buildPlaceholder` function. This function automatically infers the exception type with the first argument.

```typescript
{
  placeholders: {
    clientCode: buildPlaceholder(
      () => BaseException,
      exception => exception.getClientCode(),
    ),
  },
}
```
:::

See our [demo project](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/blob/develop/demo/src/app.controller.ts#L45) for a more detailed example.
