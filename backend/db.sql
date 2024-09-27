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
  courseID VARCHAR(255) NOT NULL,
  courseTitle VARCHAR(255) NOT NULL,
  courseDescription TEXT NOT NULL, 
  courseType ENUM('current', 'previous') NOT NULL,
  teacherUsername VARCHAR(255) NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (courseID, semester),
  FOREIGN KEY (teacherUsername) REFERENCES users (username)
) ENGINE = innodb;

DROP TABLE IF EXISTS sections;

CREATE TABLE sections (
  sectionID VARCHAR(255) NOT NULL,
  sectionDescription TEXT NOT NULL,
  courseID VARCHAR(255) NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (courseID, sectionID, semester),
  FOREIGN KEY (courseID, semester) REFERENCES courses (courseID, semester)
) ENGINE = innodb;
