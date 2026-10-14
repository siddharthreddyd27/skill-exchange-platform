-- ===================================================
-- Skill Exchange Platform - MySQL Schema & Seed Data
-- Database: skill_exchange
-- ===================================================

CREATE DATABASE IF NOT EXISTS `skill_exchange` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `skill_exchange`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `bio` TEXT,
    `avatar_url` VARCHAR(512),
    `interests` VARCHAR(255),
    `location` VARCHAR(100),
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skills Table
CREATE TABLE IF NOT EXISTS `skills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `category` VARCHAR(60) NOT NULL,
    `description` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Skills Table
CREATE TABLE IF NOT EXISTS `user_skills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    `skill_type` VARCHAR(20) NOT NULL, -- 'TEACH' or 'LEARN'
    `proficiency_level` VARCHAR(30) NOT NULL DEFAULT 'INTERMEDIATE', -- 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
    `description` TEXT,
    `years_of_experience` INT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_user_skills_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uk_user_skill_type` UNIQUE (`user_id`, `skill_id`, `skill_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Connection Requests Table
CREATE TABLE IF NOT EXISTS `connection_requests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `sender_id` BIGINT NOT NULL,
    `receiver_id` BIGINT NOT NULL,
    `message` VARCHAR(500),
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'REJECTED'
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `responded_at` DATETIME DEFAULT NULL,
    CONSTRAINT `fk_conn_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_conn_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skill Exchanges Table
CREATE TABLE IF NOT EXISTS `skill_exchanges` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `initiator_id` BIGINT NOT NULL,
    `partner_id` BIGINT NOT NULL,
    `initiator_skill_id` BIGINT NOT NULL,
    `partner_skill_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `learning_goals` TEXT,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PROPOSED', -- 'PROPOSED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    `schedule_info` VARCHAR(150),
    `notes` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_exchange_initiator` FOREIGN KEY (`initiator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_exchange_partner` FOREIGN KEY (`partner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_exchange_initiator_skill` FOREIGN KEY (`initiator_skill_id`) REFERENCES `skills` (`id`),
    CONSTRAINT `fk_exchange_partner_skill` FOREIGN KEY (`partner_skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
