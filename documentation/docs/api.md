---
title: API description
---

This document covers all additional option properties which may be passed to the decorator.

## Overview

```typescript
{
  template?: any;
  contentType?: string;
  description?: string;
  schema?: SchemaObject | ReferenceObject;
  type?: () => string | Function;
  isArray?: boolean;
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
  error: '$description',
}
```

The template specifies the example value which will be shown in Swagger UI.

#### Possible placeholders

| Placeholder    | Description                                                                                                                                 | Example     |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :---------- |
| `$status`      | Resolved with the status code of the exception                                                                                              | `404`       |
| `$description` | Either resolved with the description passed as option or if no description is specified, the messages of the passed exceptions will be used | `Not Found` |

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
