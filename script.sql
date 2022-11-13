CREATE SCHEMA IF NOT EXISTS `report_manager`;
USE `report_manager`;

CREATE TABLE IF NOT EXISTS `user` (
	`id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_code` VARCHAR(50) NOT NULL,
    `first_name` NVARCHAR(50) NOT NULL,
    `last_name` NVARCHAR(50) NOT NULL,
    `dob` DATETIME NOT NULL,
    `phone_number` VARCHAR(10) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
	`password` VARCHAR(50) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_stamp` DATETIME,
    `modified_stamp` DATETIME
);

CREATE TABLE IF NOT EXISTS `role` (
	`id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR (30) NOT NULL
);

CREATE TABLE IF NOT EXISTS `user_roles` (
	`id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS `report` (
	`id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `file_name` NVARCHAR(100) NOT NULL,
    `content` TEXT NULL,
    `vector` TEXT NULL,
    `link` NVARCHAR(100) NOT NULL,
    `mark` double NULL,
    `created_id` BIGINT NOT NULL,
    `created_stamp` DATETIME
);

CREATE TABLE IF NOT EXISTS `owner` (
	`id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `owner_code` VARCHAR(30) NOT NULL,
	`name` INTEGER NOT NULL,
    `email` BIGINT NOT NULL,
    `type` INTEGER NOT NULL,
    `created_stamp` DATETIME
);

CREATE TABLE IF NOT EXISTS `report_owner` (
	`id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `report_id` BIGINT NOT NULL,
    `owner_id` BIGINT NOT NULL
);

ALTER TABLE `user_roles`
    ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES `user` (id); 
ALTER TABLE `user_roles`
    ADD CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES `role` (id); 
 ALTER TABLE `report_owner`
    ADD CONSTRAINT fk_report_owner_report FOREIGN KEY (report_id) REFERENCES `report` (id); 
ALTER TABLE `report_owner`
    ADD CONSTRAINT fk_report_owner_owner FOREIGN KEY (owner_id) REFERENCES `owner` (id);    
ALTER TABLE `report`
    ADD CONSTRAINT fk_report_user FOREIGN KEY (created_id) REFERENCES `user` (id);
