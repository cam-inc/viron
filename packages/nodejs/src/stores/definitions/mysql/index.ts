import * as auditLogs from './auditlogs';
import * as adminUsers from './adminusers';

export { adminUsers, auditLogs };

export interface MysqlDefinitions {
  adminUsers: {
    name: string;
    createModel: typeof adminUsers.createModel;
  };
  auditLogs: {
    name: string;
    createModel: typeof auditLogs.createModel;
  };
}

export interface MysqlModels {
  adminUsers: {
    Model: adminUsers.AdminUserModelCtor;
  };
  auditLogs: {
    Model: auditLogs.AuditLogModelCtor;
  };
}
