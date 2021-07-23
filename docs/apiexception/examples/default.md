---
title: Default decorator
---

Defining your exceptions with the default decorator prints your exceptions in Swagger API documentation like this:

```typescript
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@Controller()
@ApiException(() => UnauthorizedException, { description: 'User is not authorized' })
export class AppController {

  @Put('/exception')
  @ApiOperation({ summary: 'This is an example with an error' })
  @ApiException(() => BadRequestException, { description: 'Required attributes were missing' })
  throwException() {
    throw new BadRequestException();
  }
}
```

![Default decorator screenshot example](../../../static/img/decorator.png)
