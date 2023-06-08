CREATE TABLE IF NOT EXISTS auditlogs (
    id INTEGER UNSIGNED NOT NULL auto_increment,
    requestMethod VARCHAR(255),
    requestUri VARCHAR(2048),
    sourceIp VARCHAR(255),
    userId VARCHAR(255),
    requestBody TEXT,
    statusCode INTEGER UNSIGNED,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
