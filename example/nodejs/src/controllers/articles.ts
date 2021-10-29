import { RouteContext } from '../application';
import {
  list,
  createOne,
  updateOneById,
  removeOneById,
} from '../domains/article';

// 記事一覧
export const listArticles = async (context: RouteContext): Promise<void> => {
  const { size, page, sort, articleId } = context.params.query;
  const conditions = articleId ? { id: articleId } : {};
  const result = await list(conditions, size, page, sort);
  context.res.json(result);
};

// 記事作成
export const createArticle = async (context: RouteContext): Promise<void> => {
  const article = await createOne(context.requestBody);
  context.res.status(201).json(article);
};

// 記事更新
export const updateArticle = async (context: RouteContext): Promise<void> => {
  await updateOneById(context.params.path.articleId, context.requestBody);
  context.res.status(204).end();
};

// 記事削除
export const removeArticle = async (context: RouteContext): Promise<void> => {
  await removeOneById(context.params.path.articleId);
  context.res.status(204).end();
};
