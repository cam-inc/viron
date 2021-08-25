export const list = [
  {
    title: 'sample',
    body: [
      {
        linkArea: 'https://example.com/sample_article',
      },
      {
        textArea: 'This is the text area.',
      },
      {
        headingTextArea: {
          level: 'h2',
          text: 'This is the h2 text area.',
        },
      },
      {
        textButtonArea: {
          text: 'Push Here!',
          link: 'https://example.com/sample_button',
        },
      },
      {
        relatedArticleArea: {
          relatedArticles: [
            {
              text: 'This is the related article 1 text area.',
              link: 'https://example.com/related_article_1',
            },
            {
              text: 'This is the related article 2 text area.',
              link: 'https://example.com/related_article_2',
            },
          ],
        },
      },
    ],
  },
];
