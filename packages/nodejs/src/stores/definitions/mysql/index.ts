import * as auditLog from './auditlog';

export { auditLog };

export interface MysqlDefinitions {
  auditLog: {
    name: string;
    createModel: typeof auditLog.createModel;
  };
}

export interface MysqlModels {
  auditLog: {
    Model: auditLog.AuditLogModelCtor;
  };
}
