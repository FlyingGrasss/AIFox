// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { project } from './project'
import { comment } from './comment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, project, comment],
}
