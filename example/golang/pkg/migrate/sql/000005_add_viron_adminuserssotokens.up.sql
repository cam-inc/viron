CREATE TABLE IF NOT EXISTS `adminuserssotokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `clientId` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `authType` varchar(255) NOT NULL,
  `accessToken` varchar(2048) NOT NULL,
  `expiryDate` bigint NOT NULL,
  `idToken` varchar(2048) NOT NULL,
  `refreshToken` varchar(2048) DEFAULT NULL,
  `tokenType` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `adminuserssotokens_user_id_client_id` (`userId`,`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;