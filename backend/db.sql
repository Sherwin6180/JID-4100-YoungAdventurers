DROP DATABASE IF EXISTS evaluation;
CREATE DATABASE IF NOT EXISTS evaluation;

USE evaluation;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  accountType ENUM('student', 'teacher') NOT NULL,
  securityQuestion1 VARCHAR(255) NOT NULL,
  securityAnswer1 VARCHAR(255) NOT NULL,
  securityQuestion2 VARCHAR(255) NOT NULL,
  securityAnswer2 VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = innodb;

DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
  courseID VARCHAR(255) NOT NULL,
  courseTitle VARCHAR(255) NOT NULL,
  courseDescription TEXT NOT NULL, 
  courseType ENUM('current', 'previous') NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (courseID, semester)
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
  allowGroupChange BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (courseID, sectionID, semester),
  FOREIGN KEY (courseID, semester) REFERENCES courses (courseID, semester)
) ENGINE = innodb;

DROP TABLE IF EXISTS student_groups;

CREATE TABLE student_groups (
  groupID INT AUTO_INCREMENT PRIMARY KEY,
  courseID VARCHAR(255) NOT NULL,
  sectionID VARCHAR(255) NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  groupName VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (courseID, sectionID, semester) REFERENCES sections (courseID, sectionID, semester) ON DELETE CASCADE
) ENGINE = InnoDB;

DROP TABLE IF EXISTS enrollments;

CREATE TABLE enrollments (
  studentUsername VARCHAR(255) NOT NULL,
  courseID VARCHAR(255) NOT NULL,
  sectionID VARCHAR(255) NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  groupID INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (studentUsername, courseID, sectionID, semester),
  FOREIGN KEY (studentUsername) REFERENCES users (username) ON DELETE CASCADE,
  FOREIGN KEY (courseID, sectionID, semester) REFERENCES sections (courseID, sectionID, semester),
  FOREIGN KEY (groupID) REFERENCES student_groups (groupID) ON DELETE SET NULL
) ENGINE = innodb;

DROP TABLE IF EXISTS teachings;

CREATE TABLE teachings (
  teacherUsername VARCHAR(255) NOT NULL,
  courseID VARCHAR(255) NOT NULL,
  sectionID VARCHAR(255) NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (teacherUsername, courseID, sectionID, semester),
  FOREIGN KEY (teacherUsername) REFERENCES users (username) ON DELETE CASCADE,
  FOREIGN KEY (courseID, sectionID, semester) REFERENCES sections (courseID, sectionID, semester)
) ENGINE = innodb;

DROP TABLE IF EXISTS assignments;

CREATE TABLE assignments (
  assignmentID INT AUTO_INCREMENT PRIMARY KEY, -- Make assignmentID the primary key
  courseID VARCHAR(255) NOT NULL,
  semester ENUM('Spring 2024', 'Summer 2024', 'Fall 2024', 
                'Spring 2025', 'Summer 2025', 'Fall 2025',
                'Spring 2026', 'Summer 2026', 'Fall 2026',
                'Spring 2027', 'Summer 2027', 'Fall 2027',
                'Spring 2028', 'Summer 2028', 'Fall 2028',
                'Spring 2029', 'Summer 2029', 'Fall 2029',
                'Spring 2030', 'Summer 2030', 'Fall 2030') NOT NULL,
  sectionID VARCHAR(255) NOT NULL,
  assignmentTitle VARCHAR(255) NOT NULL,
  dueDateTime DATETIME NOT NULL,
  evaluateGoals BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (courseID, semester, sectionID) REFERENCES sections (courseID, semester, sectionID)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS goals;

CREATE TABLE goals (
  goalID INT AUTO_INCREMENT PRIMARY KEY,-- Make goalID the primary key
  studentUsername VARCHAR(255) NOT NULL,
  assignmentID INT NOT NULL,
  goalText TEXT NOT NULL,
  UNIQUE (studentUsername, assignmentID),
  INDEX (assignmentID, studentUsername),  -- Added index for foreign key reference
  FOREIGN KEY (studentUsername) REFERENCES users (username) ON DELETE CASCADE,
  FOREIGN KEY (assignmentID) REFERENCES assignments (assignmentID) ON DELETE CASCADE
) ENGINE = InnoDB;

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  questionID INT AUTO_INCREMENT PRIMARY KEY,
  assignmentID INT NOT NULL,
  questionText VARCHAR(255) NOT NULL,
  questionType ENUM('rating', 'multiple_choice', 'free_response', 'goal') NOT NULL,
  questionOptions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignmentID) REFERENCES assignments (assignmentID) ON DELETE CASCADE
) ENGINE = InnoDB;


DROP TABLE IF EXISTS student_submission;

CREATE TABLE student_submission (
  submissionID INT AUTO_INCREMENT PRIMARY KEY,
  assignmentID INT NOT NULL,
  studentUsername VARCHAR(255) NOT NULL,
  evaluateeUsername VARCHAR(255) DEFAULT NULL,
  status ENUM('in_progress', 'submitted') DEFAULT 'in_progress',
  last_saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  UNIQUE KEY unique_submission (assignmentID, studentUsername, evaluateeUsername),
  FOREIGN KEY (assignmentID) REFERENCES assignments (assignmentID) ON DELETE CASCADE,
  FOREIGN KEY (studentUsername) REFERENCES enrollments (studentUsername) ON DELETE CASCADE,
  FOREIGN KEY (evaluateeUsername) REFERENCES users (username) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answerID INT AUTO_INCREMENT PRIMARY KEY,
  submissionID INT NOT NULL,
  questionID INT NOT NULL,
  studentAnswer JSON,
  ratingValue INT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_answer (submissionID, questionID),
  FOREIGN KEY (submissionID) REFERENCES student_submission (submissionID) ON DELETE CASCADE,
  FOREIGN KEY (questionID) REFERENCES questions (questionID) ON DELETE CASCADE
) ENGINE = InnoDB;

DROP TABLE IF EXISTS scores;

CREATE TABLE scores (
  scoreID INT AUTO_INCREMENT PRIMARY KEY,
  assignmentID INT NOT NULL,
  studentUsername VARCHAR(255) NOT NULL,
  score DECIMAL(5, 2) DEFAULT NULL,
  published BOOLEAN DEFAULT FALSE,
  finalizedAt TIMESTAMP NULL,
  FOREIGN KEY (assignmentID) REFERENCES assignments (assignmentID) ON DELETE CASCADE,
  FOREIGN KEY (studentUsername) REFERENCES users (username) ON DELETE CASCADE
) ENGINE = InnoDB;