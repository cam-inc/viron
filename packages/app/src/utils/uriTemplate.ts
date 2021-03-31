import _ from 'lodash';

export const parse = function (
  template: string,
  pathParams: { [key in string]: string }
): string {
  _.forEach(pathParams, (value, key) => {
    template = template.replace(`{${key}}`, value);
  });
  return template;
};
