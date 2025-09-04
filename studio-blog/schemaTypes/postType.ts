import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
        name: 'body',
        type: 'array',
        of: [
          { type: 'block',
            lists: [
              { title: 'Bullet', value: 'bullet' },
              { title: 'Numbered', value: 'number' },
              { title: 'Check', value: 'check' },
              { title: 'Quote', value: 'quote' },
              { title: 'Code', value: 'code' },
              { title: 'Inline Code', value: 'inlineCode' },
              { title: 'Image', value: 'image' },
            ],
           },
          {
            type: 'image',
            fields: [
              { name: 'alt', type: 'string', title: 'Alt' },
              { name: 'caption', type: 'string', title: 'Caption' },
            ],
            options: { hotspot: true },
          },

        ],
      }),
  ],
})
