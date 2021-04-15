module.exports = {
  docs: [
    {
      type: 'category',
      label: 'ApiException',
      items: [
        'apiexception/introduction',
        {
          type: 'category',
          label: 'Examples',
          items: [
            'apiexception/examples/default',
            'apiexception/examples/default-grouping',
            'apiexception/examples/template',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'gettingstarted/installation',
        {
          type: 'category',
          label: 'Usage',
          items: ['gettingstarted/usage/simple', 'gettingstarted/usage/custom', 'gettingstarted/usage/templated'],
        },
      ],
    },
    {
      type: 'doc',
      id: 'api',
    },
    {
      type: 'category',
      label: 'Release Notes',
      items: ['releasenotes/v1.2.0'],
    },
  ],
};
