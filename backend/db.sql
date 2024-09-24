drop database if exists evaluation;
CREATE DATABASE IF NOT EXISTS evaluation;

USE evaluation;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  accountType ENUM('student', 'teacher') NOT NULL,
  securityQuestion1 VARCHAR(255) NOT NULL,
  securityAnswer1 VARCHAR(255) NOT NULL,
  securityQuestion2 VARCHAR(255) NOT NULL,
  securityAnswer2 VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) engine = innodb;

DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
  courseTitle VARCHAR(255) NOT NULL UNIQUE,
  courseType ENUM('current', 'previous') NOT NULL,
  primary key (courseTitle)
) engine = innodb;
