-- Schema for Mediatiz Summer Camp Platform

CREATE DATABASE IF NOT EXISTS mediatiz_camp;
USE mediatiz_camp;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    camp_code VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
    total_score INT DEFAULT 0,
    today_score INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Point Events table
CREATE TABLE IF NOT EXISTS point_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    points INT NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'Quiz', 'Wheel', 'Instructor Award'
    description VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Quiz Questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    difficulty VARCHAR(20) DEFAULT 'Intermediate'
);

-- Insert default instructor
INSERT INTO instructors (name, email, password_hash)
VALUES ('Camp Master', 'instructor@mediatiz.com', 'scrypt:32768:8:1$pYp4fXfB9B9z$db67ad108f9c1db163c46e0129cf65cc870425a815a51a9172bbcb1495c07386008b8b0e8b8398e4f5169a8426ecfa7e781c81ef45db473be90666016e788bc5')
ON DUPLICATE KEY UPDATE id=id; -- password: password123

-- Seed basic quiz questions
INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_option, difficulty)
VALUES 
('What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language', 'A', 'Beginner'),
('Which CSS property controls the text size?', 'font-style', 'text-size', 'font-size', 'text-style', 'C', 'Beginner'),
('How do you write "Hello World" in an alert box in JavaScript?', 'msgBox("Hello World");', 'alertBox("Hello World");', 'msg("Hello World");', 'alert("Hello World");', 'D', 'Beginner'),
('Which of the following is NOT a valid Python data type?', 'List', 'Tuple', 'Constant', 'Dictionary', 'C', 'Intermediate'),
('What is the default port number for a Flask application?', '8080', '5000', '3000', '8000', 'B', 'Intermediate'),
('In MySQL, which clause is used to filter records?', 'ORDER BY', 'GROUP BY', 'WHERE', 'HAVING', 'C', 'Intermediate'),
('What is the correct syntax for referring to an external script called "xxx.js"?', '<script href="xxx.js">', '<script name="xxx.js">', '<script src="xxx.js">', '<script file="xxx.js">', 'C', 'Beginner'),
('Which HTTP method is typically used to update resource data?', 'GET', 'POST', 'PUT', 'DELETE', 'C', 'Advanced');
