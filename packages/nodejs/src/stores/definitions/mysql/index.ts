import * as auditLogs from './auditlogs';

export { auditLogs };

export interface MysqlDefinitions {
  auditLogs: {
    name: string;
    createModel: typeof auditLogs.createModel;
  };
}

export interface MysqlModels {
  auditLogs: {
    Model: auditLogs.AuditLogModelCtor;
  };
}
