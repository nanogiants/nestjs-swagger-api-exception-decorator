import { ContentObject, ExampleObject, ReferenceObject } from './open-api.interface';

export type MetaContent = Record<string, ContentObject>;
export type Examples = Record<string, ExampleObject | ReferenceObject>;
