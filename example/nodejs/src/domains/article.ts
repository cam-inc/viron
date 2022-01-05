import {
  ListWithPager,
  TABLE_SORT_DELIMITER,
  TABLE_SORT_ORDER,
} from '@viron/lib';
import { FindConditions, getArticleRepository } from '../repositories';

export interface Article {
  id: string;
  title: string;
  body: ArticleBodyItem[];
  createdAt: number;
  updatedAt: number;
}

export type ArticleBodyItem =
  | ArticleBodyItemLinkArea
  | ArticleBodyItemTextArea
  | ArticleBodyItemHeadingTextArea
  | ArticleBodyItemTextButtonArea
  | ArticleBodyItemRelatedArticleArea;

export interface ArticleBodyItemLinkArea {
  linkArea: string;
}

export interface ArticleBodyItemTextArea {
  textArea: string;
}

export interface ArticleBodyItemHeadingTextArea {
  headingTextArea: {
    level: string;
    text: string;
  };
}

export interface ArticleBodyItemTextButtonArea {
  textButtonArea: {
    text: string;
    link: string;
  };
}

export interface ArticleBodyItemRelatedArticleArea {
  relatedArticleArea: {
    relatedArticles: RelatedArticle[];
  };
}

interface RelatedArticle {
  text: string;
  link: string;
}

export interface ArticleView extends Article {
  articleId: string; // alias to id
}

export interface ArticleCreateAttributes {
  title: string;
  body: ArticleBodyItem[];
}

export interface ArticleUpdateAttributes {
  title: string;
  body: ArticleBodyItem[];
}

const format = (article: Article): ArticleView => {
  return Object.assign({}, article, { articleId: article.id });
};

export const list = async (
  conditions?: FindConditions<Article>,
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<ArticleView>> => {
  const repository = getArticleRepository();
  const result = await repository.findWithPager(conditions, size, page, sort);
  return {
    ...result,
    list: result.list.map(format),
  };
};

export const findOne = async (
  conditions: FindConditions<Article>
): Promise<ArticleView> => {
  const repository = getArticleRepository();
  const article = await repository.findOne(conditions);
  return format(article);
};

export const createOne = async (
  payload: ArticleCreateAttributes
): Promise<ArticleView> => {
  const repository = getArticleRepository();
  const article = await repository.createOne(payload);
  return format(article);
};

export const updateOneById = async (
  id: string,
  payload: ArticleUpdateAttributes
): Promise<void> => {
  const repository = getArticleRepository();
  await repository.updateOneById(id, payload);
};

export const removeOneById = async (id: string): Promise<void> => {
  const repository = getArticleRepository();
  await repository.removeOneById(id);
};
