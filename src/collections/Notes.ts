import { CollectionConfig } from 'payload'

export const Notes: CollectionConfig = {
  slug: 'notes',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
  ],
}
