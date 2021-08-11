CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER UNSIGNED NOT NULL auto_increment ,
    `name` VARCHAR(255),
    `nickName` VARCHAR(255),
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;