import {
  genAuthConfigs,
  AuthConfigDefinitions,
} from '../../src/domains/authconfig';
import { VironOpenAPIObject } from '../../src/domains/oas';
import {
  AUTH_CONFIG_PROVIDER,
  AUTH_CONFIG_TYPE,
  API_METHOD,
} from '../../src/constants';
import { operationNotFound } from '../../src/errors';
import * as oas from '../../src/domains/oas';
import sinon from 'sinon';

const mockOas: VironOpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Mock API',
    version: '1.0.0',
  },
  paths: {
    '/mock/path': {
      post: {
        operationId: 'mockOperation',
        responses: {
          '200': {
            description: 'OK',
          },
        },
      },
    },
  },
};

describe('genAuthConfigs', () => {
  it('should generate auth configs correctly', () => {
    const authConfigDefinitions: AuthConfigDefinitions = [
      {
        provider: AUTH_CONFIG_PROVIDER.VIRON,
        type: AUTH_CONFIG_TYPE.EMAIL,
        method: API_METHOD.POST,
        path: '/mock/path',
        defaultParametersValue: { param1: 'value1' },
        defaultRequestBodyValue: { body1: 'value1' },
      },
    ];

    const result = genAuthConfigs(authConfigDefinitions, mockOas);

    expect(result.list).toHaveLength(1);
    expect(result.list[0].provider).toBe(AUTH_CONFIG_PROVIDER.VIRON);
    expect(result.list[0].type).toBe(AUTH_CONFIG_TYPE.EMAIL);
    expect(result.list[0].operationId).toBe('mockOperation');
    expect(result.list[0].defaultParametersValue).toEqual({ param1: 'value1' });
    expect(result.list[0].defaultRequestBodyValue).toEqual({ body1: 'value1' });
  });

  it('should throw an error if operation is not found', () => {
    const authConfigDefinitions: AuthConfigDefinitions = [
      {
        provider: AUTH_CONFIG_PROVIDER.VIRON,
        type: AUTH_CONFIG_TYPE.EMAIL,
        method: API_METHOD.POST,
        path: '/invalid/path',
      },
    ];

    const sandbox = sinon.createSandbox();
    const findOperationStub = sandbox.stub(oas, 'findOperation');
    findOperationStub.onCall(0).returns({
      operationId: 'mockOperation',
      responses: { '200': { description: 'OK' } },
    });
    findOperationStub.onCall(1).returns(null);

    expect(() => genAuthConfigs(authConfigDefinitions, mockOas)).toThrow(
      operationNotFound()
    );

    sandbox.restore();
  });

  it('should throw an error if operation is not found in genAuthConfig', () => {
    const authConfigDefinitions: AuthConfigDefinitions = [
      {
        provider: AUTH_CONFIG_PROVIDER.VIRON,
        type: AUTH_CONFIG_TYPE.EMAIL,
        method: API_METHOD.POST,
        path: '/invalid/path',
      },
    ];
    const sandbox = sinon.createSandbox();
    const findOperationStub = sandbox.stub(oas, 'findOperation');
    findOperationStub.onCall(0).returns(null);

    expect(() => genAuthConfigs(authConfigDefinitions, mockOas)).toThrow(
      operationNotFound()
    );
    sandbox.restore();
  });
});
