import { ContentObject, ExampleObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type MetaContent = Record<string, ContentObject>;
export type Examples = Record<string, ExampleObject | ReferenceObject>;
