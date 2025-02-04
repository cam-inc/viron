import { ErrorRequestHandler } from 'express';
import accepts from 'accepts';
import { HTTP_HEADER } from '@viron/lib';
import { logger } from '../context';
import sanitizeHtml from 'sanitize-html';

// 特殊文字をUnicodeエスケープする
const escapeToUnicode = (input: string): string => {
  return input.replace(/[<>"'&]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003C';
      case '>':
        return '\\u003E';
      case '&':
        return '\\u0026';
      case '"':
        return '\\u0022';
      case "'":
        return '\\u0027';
      default:
        return char;
    }
  });
};

// サニタイズ
const sanitizeErrorContent = (content: string): string => {
  return escapeToUnicode(sanitizeHtml(content));
};

export const middlewareErrorHandler = (): ErrorRequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, req, res, _next): void => {
    if (err.statusCode) {
      res.statusCode = err.statusCode;
    }
    if (err.status) {
      res.statusCode = err.status;
    }
    if (res.statusCode < 400) {
      res.statusCode = 500;
    }

    logger.error(
      'An error occured. %o, %s',
      err,
      err.stack ?? new Error().stack
    );

    const accept = accepts(req);
    switch (accept.type(['json', 'text'])) {
      case 'json': {
        res.setHeader(
          HTTP_HEADER.CONTENT_TYPE,
          'application/json; charset=utf-8'
        );
        const sanitizedMessage = sanitizeErrorContent(err.message);
        // expressデフォルトのエラーハンドラーのみerr.stackが空になるが、独自エラーハンドラーはerr.stackが表示されるので明示的に表示判断する
        const sanitizedStack =
          process.env.NODE_ENV !== 'production'
            ? sanitizeErrorContent(err.stack ?? '')
            : undefined;
        res.json({
          message: sanitizedMessage,
          ...(sanitizedStack ? { stack: sanitizedStack } : {}),
        });
        break;
      }
      default:
        res.setHeader(HTTP_HEADER.CONTENT_TYPE, 'text/plain; charset=utf-8');
        // expressデフォルトのエラーハンドラーのみerr.stackが空になるが、独自エラーハンドラーはerr.stackが表示されるので明示的に表示判断する
        res.send(
          sanitizeErrorContent(
            JSON.stringify({
              message: err.message,
              ...(process.env.NODE_ENV !== 'production'
                ? { stack: err.stack }
                : {}),
            })
          )
        );
        break;
    }
  };
};
