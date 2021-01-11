module.exports = {
  docs: {
    ApiException: [
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
    'Getting Started': [
      'gettingstarted/installation',
      {
        type: 'category',
        label: 'Usage',
        items: ['gettingstarted/usage/simple', 'gettingstarted/usage/custom', 'gettingstarted/usage/templated'],
      },
    ],
  },
};
