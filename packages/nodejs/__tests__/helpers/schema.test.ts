import assert from 'assert';
import { VironSchemaObject } from '../../src/domains/oas';
import {
  listSchemaPathRegExp,
  replaceSchemaValueByRegExp,
} from '../../src/helpers/schema';

describe('helpers/schemas', () => {
  describe('listSchemaPathRegExp', () => {
    it('Return all paths.', () => {
      const schema: VironSchemaObject = {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'name'],
      };
      const list = listSchemaPathRegExp(schema);
      assert.strictEqual(list.length, 2);
      assert(list[0].test('/id'));
      assert(!list[0].test('/id/hoge'));
      assert(list[1].test('/name'));
      assert(!list[1].test('/names'));
    });

    it('Return filtered paths.', () => {
      const schema: VironSchemaObject = {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'name'],
      };
      const list = listSchemaPathRegExp(
        schema,
        (v): boolean => v.type === 'string'
      );
      assert.strictEqual(list.length, 1);
      assert(list[0].test('/name'));
      assert(!list[0].test('/names'));
    });

    it('array', () => {
      const schema: VironSchemaObject = {
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };
      const list = listSchemaPathRegExp(
        schema,
        (v): boolean => v.type === 'string'
      );
      assert.strictEqual(list.length, 1);
      assert(list[0].test('/arr/0'));
      assert(!list[0].test('/arr/a'));
    });

    it('nesting', () => {
      const schema: VironSchemaObject = {
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                list: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const list = listSchemaPathRegExp(
        schema,
        (v): boolean => v.type === 'string'
      );
      assert.strictEqual(list.length, 1);
      assert(list[0].test('/arr/0/list/99/name'));
      assert(!list[0].test('/arr/0/list/99/hoge'));
    });
  });

  describe('replaceSchemaValueByRegExp', () => {
    it('Replace `name`.', () => {
      const regexp = /^\/name$/;
      const value = {
        id: 1,
        name: 'test',
      };
      const replacer = (): string => 'replaced';
      const result = replaceSchemaValueByRegExp(value, regexp, replacer);
      assert.strictEqual(result.id, 1);
      assert.strictEqual(result.name, 'replaced');
      assert.strictEqual(value.name, 'test'); // unbroken
    });

    it('Replace all matches.', () => {
      const regexps = [/^\/name$/, /^\/list\/\d{1,}\/value$/];
      const value = {
        id: 1,
        name: 'test',
        list: [
          {
            value: 'xxx',
          },
          {
            value: 'yyy',
          },
          {
            value: 888,
          },
        ],
      };
      const replacer = (): string => 'replaced';
      const result = replaceSchemaValueByRegExp(value, regexps, replacer);
      assert.strictEqual(result.id, 1);
      assert.strictEqual(result.name, 'replaced');
      assert.strictEqual(result.list[0].value, 'replaced');
      assert.strictEqual(result.list[1].value, 'replaced');
      assert.strictEqual(result.list[2].value, 'replaced');
    });
  });
});
